"""Launch + market simulation checks for newly published demo tokens."""

import uuid


def _create_simulation(api_client, api_url: str) -> str:
    created = api_client.post(f"{api_url}/simulations")
    assert created.status_code == 201
    return created.json()["id"]


def _launch(api_client, api_url: str, sim_id: str, suffix: str = "MKT") -> dict:
    payload = {
        "name": f"TEST_AUTO_{suffix}_Token",
        "ticker": f"M{suffix}"[:10],
        "description": "TEST_AUTO launch for market simulation regression.",
        "image_id": None,
        "website": "https://example.com",
        "twitter": "https://x.com/example",
        "telegram": "https://t.me/example",
        "target_sol": 8.5,
        "asset": "SOL",
        "global_asset": "SOL",
        "mode": "SHARE",
        "simulation_id": sim_id,
        "request_id": str(uuid.uuid4()),
        "wallet_provider": "Phantom",
    }
    launched = api_client.post(f"{api_url}/launch", json=payload)
    assert launched.status_code == 201
    return launched.json()


def test_launched_project_starts_without_fake_volume_holders_or_history(api_client, api_url):
    sim_id = _create_simulation(api_client, api_url)
    try:
        launched = _launch(api_client, api_url, sim_id, suffix="BASE")
        detail = api_client.get(f"{api_url}/projects/{launched['id']}")
        assert detail.status_code == 200
        data = detail.json()
        assert data["is_launched"] is True and data["holders"] == 0 and data["volume"] == 0 and data["history"] == []
    finally:
        api_client.delete(f"{api_url}/simulations/{sim_id}")


def test_launched_project_candles_support_expected_intervals_with_flat_bars(api_client, api_url):
    sim_id = _create_simulation(api_client, api_url)
    try:
        launched = _launch(api_client, api_url, sim_id, suffix="CNDL")
        for timeframe in ["1m", "5m", "15m", "1h", "4h"]:
            candles = api_client.get(f"{api_url}/market/{launched['id']}/candles", params={"timeframe": timeframe})
            assert candles.status_code == 200
            body = candles.json()
            assert body["timeframe"] == timeframe and body["data_mode"] == "simulation" and len(body["candles"]) >= 1
            assert all(c["open"] == c["high"] == c["low"] == c["close"] for c in body["candles"])
    finally:
        api_client.delete(f"{api_url}/simulations/{sim_id}")


def test_launched_project_activity_empty_before_trades(api_client, api_url):
    sim_id = _create_simulation(api_client, api_url)
    try:
        launched = _launch(api_client, api_url, sim_id, suffix="EMPTY")
        trades = api_client.get(f"{api_url}/market/{launched['id']}/trades")
        holders = api_client.get(f"{api_url}/market/{launched['id']}/holders")
        assert trades.status_code == 200 and trades.json()["items"] == [] and trades.json()["data_mode"] == "simulation"
        assert holders.status_code == 200 and holders.json()["items"] == [] and holders.json()["total"] == 0
    finally:
        api_client.delete(f"{api_url}/simulations/{sim_id}")


def test_launched_project_buy_sell_updates_holders_volume_and_public_activity(api_client, api_url):
    sim_id = _create_simulation(api_client, api_url)
    try:
        launched = _launch(api_client, api_url, sim_id, suffix="TRAD")
        buy = api_client.post(
            f"{api_url}/simulations/{sim_id}/orders",
            json={"project_id": launched["id"], "side": "buy", "amount": 1, "request_id": str(uuid.uuid4())},
        )
        assert buy.status_code == 200
        quantity = buy.json()["trade"]["quantity"]

        sell = api_client.post(
            f"{api_url}/simulations/{sim_id}/orders",
            json={"project_id": launched["id"], "side": "sell", "amount": quantity / 2, "request_id": str(uuid.uuid4())},
        )
        assert sell.status_code == 200

        detail = api_client.get(f"{api_url}/projects/{launched['id']}")
        trades = api_client.get(f"{api_url}/market/{launched['id']}/trades")
        holders = api_client.get(f"{api_url}/market/{launched['id']}/holders")
        assert detail.status_code == 200 and detail.json()["holders"] >= 1 and detail.json()["volume"] > 0
        assert trades.status_code == 200 and len(trades.json()["items"]) >= 2
        assert holders.status_code == 200 and holders.json()["total"] >= 1 and len(holders.json()["items"]) >= 1
    finally:
        api_client.delete(f"{api_url}/simulations/{sim_id}")
