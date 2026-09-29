"""Public API regression tests: config, list/detail, uploads, and launch (no drafts)."""

from concurrent.futures import ThreadPoolExecutor
import io
import json
import uuid


def _launch_payload(sim_id: str, request_id: str, suffix: str = 'A1', image_id: str | None = None):
    token_suffix = ''.join(ch for ch in suffix.upper() if ch.isalnum())[:6] or 'AUTO01'
    return {
        'name': f'TEST_AUTO_{suffix}_Paperbag Token',
        'ticker': f'T{token_suffix}'[:10],
        'description': f'TEST_AUTO launch payload {suffix}.',
        'image_id': image_id,
        'website': 'https://example.com',
        'twitter': 'https://x.com/example',
        'telegram': 'https://t.me/example',
        'target_sol': 10.25,
        'asset': 'SOL',
        'global_asset': 'USDC',
        'mode': 'SHARE',
        'simulation_id': sim_id,
        'request_id': request_id,
        'wallet_provider': 'Phantom',
    }


def _new_simulation(api_client, api_url: str) -> str:
    created = api_client.post(f'{api_url}/simulations')
    assert created.status_code == 201
    return created.json()['id']


def test_health_and_config_flags(api_client, api_url):
    health = api_client.get(f'{api_url}/')
    assert health.status_code == 200
    config = api_client.get(f'{api_url}/config')
    assert config.status_code == 200
    data = config.json()
    assert data['live_transactions'] is False and data['wallet_enabled'] is False


def test_projects_support_search_and_seed_minimum(api_client, api_url):
    response = api_client.get(f'{api_url}/projects', params={'sort': 'trending'})
    assert response.status_code == 200
    rows = response.json()
    ids = {row['id'] for row in rows}
    assert len(rows) >= 6 and {'dog', 'cat', 'ape', 'bonk', 'pepe', 'wif'}.issubset(ids)


def test_projects_search_matches_ticker_name_asset(api_client, api_url):
    ticker = api_client.get(f'{api_url}/projects', params={'search': 'DOG', 'sort': 'trending'})
    assert ticker.status_code == 200 and any(p['ticker'] == 'DOG' for p in ticker.json())

    by_name = api_client.get(f'{api_url}/projects', params={'search': 'Paper Cat', 'sort': 'trending'})
    assert by_name.status_code == 200 and any(p['id'] == 'cat' for p in by_name.json())

    by_asset = api_client.get(f'{api_url}/projects', params={'search': 'BONK', 'sort': 'trending'})
    assert by_asset.status_code == 200 and any(p['id'] == 'bonk' for p in by_asset.json())


def test_projects_invalid_sort_returns_422(api_client, api_url):
    response = api_client.get(f'{api_url}/projects', params={'sort': 'invalid'})
    assert response.status_code == 422


def test_project_detail_and_missing_id(api_client, api_url):
    ok = api_client.get(f'{api_url}/projects/dog')
    assert ok.status_code == 200 and ok.json()['id'] == 'dog'

    missing = api_client.get(f'{api_url}/projects/missing-id')
    assert missing.status_code == 404 and 'not found' in missing.text.lower()


def test_global_and_native_constraints(api_client, api_url):
    global_res = api_client.get(f'{api_url}/global')
    assert global_res.status_code == 200
    g = global_res.json()
    assert g['interval_hours'] == 24 and 'not live' in g['status'].lower()

    native = api_client.get(f'{api_url}/native')
    assert native.status_code == 200
    n = native.json()
    assert n['launched'] is False and n['configurable'] is False and n['mechanism'][1].startswith('80%')


def test_leaderboard_categories_and_invalid(api_client, api_url):
    for category in ['opened', 'biggest', 'fastest', 'profits', 'active']:
        response = api_client.get(f'{api_url}/leaderboard', params={'category': category})
        assert response.status_code == 200 and len(response.json()) == 5

    invalid = api_client.get(f'{api_url}/leaderboard', params={'category': 'bad'})
    assert invalid.status_code == 422


def test_forbidden_fee_breakdown_not_exposed(api_client, api_url):
    targets = [
        api_client.get(f'{api_url}/config').json(),
        api_client.get(f'{api_url}/overview').json(),
        api_client.get(f'{api_url}/global').json(),
        api_client.get(f'{api_url}/native').json(),
    ]
    raw = json.dumps(targets).lower()
    assert '0.4%' not in raw and '0.2%' not in raw and 'creator fee' not in raw


def test_launch_requires_valid_payload_and_known_simulation(api_client, api_url):
    empty = api_client.post(f'{api_url}/launch', json={})
    assert empty.status_code == 422

    payload = _launch_payload(str(uuid.uuid4()), str(uuid.uuid4()), suffix='BADSIM')
    missing_sim = api_client.post(f'{api_url}/launch', json=payload)
    assert missing_sim.status_code == 422 and 'reconnect your demo wallet' in missing_sim.text.lower()


def test_launch_rejects_invalid_provider_bad_links_and_missing_image(api_client, api_url):
    sim_id = _new_simulation(api_client, api_url)
    try:
        payload = _launch_payload(sim_id, str(uuid.uuid4()), suffix='INVPROV')
        payload['wallet_provider'] = 'Backpack'
        bad_provider = api_client.post(f'{api_url}/launch', json=payload)
        assert bad_provider.status_code == 422

        payload = _launch_payload(sim_id, str(uuid.uuid4()), suffix='INVLINK')
        payload['website'] = 'http://example.com'
        bad_link = api_client.post(f'{api_url}/launch', json=payload)
        assert bad_link.status_code == 422

        payload = _launch_payload(sim_id, str(uuid.uuid4()), suffix='INVIMG')
        payload['image_id'] = str(uuid.uuid4())
        missing_image = api_client.post(f'{api_url}/launch', json=payload)
        assert missing_image.status_code == 422 and 'upload your token image again' in missing_image.text.lower()
    finally:
        api_client.delete(f'{api_url}/simulations/{sim_id}')


def test_launch_idempotency_and_conflict_for_same_request_id(api_client, api_url):
    sim_id = _new_simulation(api_client, api_url)
    try:
        request_id = str(uuid.uuid4())
        payload = _launch_payload(sim_id, request_id, suffix='IDEMP1')

        first = api_client.post(f'{api_url}/launch', json=payload)
        assert first.status_code == 201
        first_data = first.json()
        assert first_data['id'] and first_data['is_launched'] is True and first_data['holders'] == 0

        duplicate_same = api_client.post(f'{api_url}/launch', json=payload)
        assert duplicate_same.status_code in (200, 201)
        assert duplicate_same.json()['id'] == first_data['id']

        changed = payload | {'name': 'TEST_AUTO_conflicting_name'}
        duplicate_changed = api_client.post(f'{api_url}/launch', json=changed)
        assert duplicate_changed.status_code == 409
    finally:
        api_client.delete(f'{api_url}/simulations/{sim_id}')


def test_launch_concurrent_duplicate_requests_create_single_project(api_client, api_url):
    sim_id = _new_simulation(api_client, api_url)
    try:
        request_id = str(uuid.uuid4())
        payload = _launch_payload(sim_id, request_id, suffix='CONCUR')

        def _post_launch():
            return api_client.post(f'{api_url}/launch', json=payload)

        with ThreadPoolExecutor(max_workers=2) as pool:
            responses = list(pool.map(lambda _: _post_launch(), [0, 1]))

        statuses = [r.status_code for r in responses]
        ids = [r.json()['id'] for r in responses if r.status_code in (200, 201)]
        assert all(s in (200, 201) for s in statuses)
        assert len(set(ids)) == 1
    finally:
        api_client.delete(f'{api_url}/simulations/{sim_id}')


def test_upload_rejects_invalid_mime(api_client, api_url):
    fake_text = io.BytesIO(b'not an image')
    response = api_client.post(
        f'{api_url}/uploads',
        files={'file': ('bad.txt', fake_text, 'text/plain')},
    )
    assert response.status_code == 415


def test_upload_accepts_real_png_and_is_fetchable(api_client, api_url):
    # 1x1 transparent PNG
    png_bytes = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89'
        b'\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    response = api_client.post(
        f'{api_url}/uploads',
        files={'file': ('tiny.png', io.BytesIO(png_bytes), 'image/png')},
    )
    assert response.status_code == 201
    file_id = response.json()['id']
    get_file = api_client.get(f'{api_url}/files/{file_id}')
    assert get_file.status_code == 200 and get_file.headers['content-type'].startswith('image/png')


def test_upload_accepts_real_jpeg_and_is_fetchable(api_client, api_url):
    # Minimal valid JPEG (SOI ... EOI)
    jpeg_bytes = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xd9'
    response = api_client.post(
        f'{api_url}/uploads',
        files={'file': ('tiny.jpg', io.BytesIO(jpeg_bytes), 'image/jpeg')},
    )
    assert response.status_code == 201
    file_id = response.json()['id']
    get_file = api_client.get(f'{api_url}/files/{file_id}')
    assert get_file.status_code == 200 and get_file.headers['content-type'].startswith('image/jpeg')


def test_missing_file_returns_404(api_client, api_url):
    response = api_client.get(f'{api_url}/files/{uuid.uuid4()}')
    assert response.status_code == 404


def test_drafts_removed_endpoints_return_404(api_client, api_url):
    missing_id = str(uuid.uuid4())
    payload = {
        'name': 'Old draft',
        'ticker': 'OLD',
        'description': 'legacy payload',
        'target_sol': 1,
        'asset': 'SOL',
        'global_asset': 'SOL',
        'mode': 'SHARE',
    }
    assert api_client.post(f'{api_url}/drafts', json=payload).status_code == 404
    assert api_client.get(f'{api_url}/drafts/{missing_id}').status_code == 404
    assert api_client.put(f'{api_url}/drafts/{missing_id}', json=payload).status_code == 404
    assert api_client.delete(f'{api_url}/drafts/{missing_id}').status_code == 404


def test_projects_and_detail_do_not_leak_internal_launch_fields(api_client, api_url):
    sim_id = _new_simulation(api_client, api_url)
    try:
        payload = _launch_payload(sim_id, str(uuid.uuid4()), suffix='LEAKCHK')
        launched = api_client.post(f'{api_url}/launch', json=payload)
        assert launched.status_code == 201
        launched_row = launched.json()
        for key in ('_id', 'creator_demo_id', 'launch_fingerprint', 'launch_request_id'):
            assert key not in launched_row

        listed = api_client.get(f"{api_url}/projects", params={'sort': 'newest'})
        assert listed.status_code == 200
        created = next((x for x in listed.json() if x['id'] == launched_row['id']), None)
        assert created is not None
        for key in ('_id', 'creator_demo_id', 'launch_fingerprint', 'launch_request_id'):
            assert key not in created

        detail = api_client.get(f"{api_url}/projects/{launched_row['id']}")
        assert detail.status_code == 200
        for key in ('_id', 'creator_demo_id', 'launch_fingerprint', 'launch_request_id'):
            assert key not in detail.json()
    finally:
        api_client.delete(f'{api_url}/simulations/{sim_id}')
