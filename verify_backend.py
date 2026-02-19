import urllib.request
import urllib.error
import json
import time

BASE_URL = 'http://127.0.0.1:5000'

def request(method, url, data=None, headers={}):
    req = urllib.request.Request(url, method=method)
    for k, v in headers.items():
        req.add_header(k, v)
    if data:
        req.add_header('Content-Type', 'application/json')
        req.data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read().decode()
            try:
                json_content = json.loads(content)
            except:
                json_content = {}
            return response.getcode(), json_content
    except urllib.error.HTTPError as e:
        content = e.read().decode()
        try:
            json_content = json.loads(content)
        except:
             json_content = {'error': content}
        return e.code, json_content
    except Exception as e:
        return 0, str(e)

def test_api():
    print("Checking server status...")
    status, _ = request('GET', BASE_URL)
    if status == 200:
        print("Server is UP.")
    else:
        print(f"Server is DOWN or returned {status}. Aborting tests.")
        return

    print("\n1. Testing Login (Admin)...")
    login_payload = {'email': 'admin@example.com', 'password': 'admin'}
    status, data = request('POST', f'{BASE_URL}/login', login_payload)
    
    token = None
    if status == 200:
        token = data.get('token')
        print("Login SUCCESS.")
    else:
        print(f"Login FAILED: {data}")

    headers = {'Authorization': f'Bearer {token}'} if token else {}

    if token:
        print("\n2. Testing Projects API...")
        # GET
        status, data = request('GET', f'{BASE_URL}/projects')
        print(f"GET /projects: {status} - Found {len(data)} projects")
        
        # POST
        project_data = {
            'name': 'API Test Project ' + str(int(time.time())),
            'description': 'Auto-generated test',
            'budget': 5000,
            'start_date': '2023-01-01',
            'end_date': '2023-12-31'
        }
        status, data = request('POST', f'{BASE_URL}/projects', project_data, headers)
        if status == 201:
            print(f"POST /projects: {status} - {data.get('message', '')}")
            pid = data.get('id')
            # Add Deliverable
            del_data = {'title': 'Phase 1', 'due_date': '2023-06-01'}
            s, d = request('POST', f'{BASE_URL}/projects/{pid}/deliverables', del_data, headers)
            print(f"POST /deliverables: {s} - {d.get('message', '')}")
        else:
            print(f"POST /projects FAILED: {status} - {data}")

        print("\n3. Testing Finance API...")
        # POST Sponsorship
        sponsor_data = {'sponsor_name': 'Test Corp', 'amount': 1000}
        status, data = request('POST', f'{BASE_URL}/sponsorships', sponsor_data, headers)
        if status == 201:
             print(f"POST /sponsorships: {status} - {data.get('message', '')}")
             sid = data.get('id')
             # Get Receipt
             status, data = request('GET', f'{BASE_URL}/receipt/{sid}')
             print(f"GET /receipt: {status} - {data.get('message', '')}")
        else:
             print(f"POST /sponsorships FAILED: {status} - {data}")

        print("\n4. Testing Analytics API...")
        status, data = request('GET', f'{BASE_URL}/analytics/performance', headers=headers)
        print(f"GET /analytics/performance: {status}")
        if status == 200:
            print(f"Stats received: {len(data.get('activity_stats', []))} records")

        print("\n5. Testing HR API (Attendance)...")
        status, data = request('POST', f'{BASE_URL}/attendance/checkin', {}, headers)
        if status == 200:
             print(f"POST /attendance/checkin: {status} - {data.get('message', '')}")
        else:
             print(f"POST /attendance/checkin FAILED: {status} - {data}")

    else:
        print("\nSkipping authenticated tests due to login failure.")

if __name__ == "__main__":
    test_api()
