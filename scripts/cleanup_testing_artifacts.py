import os
import argparse

from dotenv import load_dotenv
from pymongo import MongoClient


def main():
    parser = argparse.ArgumentParser(description='Remove only explicitly identified temporary demo test projects.')
    parser.add_argument('--project-id', action='append', required=True, help='Exact ID of a project created by your test run; repeat for multiple IDs.')
    args = parser.parse_args()
    load_dotenv('/app/backend/.env')
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    client = MongoClient(mongo_url)
    db = client[db_name]

    token_query = {'id': {'$in': args.project_id}, 'is_launched': True}

    projects = list(db.projects.find(token_query, {'_id': 0, 'id': 1, 'creator_demo_id': 1, 'name': 1, 'ticker': 1}))
    project_ids = [p['id'] for p in projects]
    sim_ids = {p.get('creator_demo_id') for p in projects if p.get('creator_demo_id')}

    if project_ids:
        db.projects.delete_many({'id': {'$in': project_ids}})

    if sim_ids:
        db.simulations.delete_many({'id': {'$in': list(sim_ids)}})

    print({'deleted_projects': len(project_ids), 'deleted_simulations': len(sim_ids), 'project_ids': project_ids})
    client.close()


if __name__ == '__main__':
    main()
