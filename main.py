import requests
from pathlib import Path

# CONFIG
TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZpY2UiLCJpYXQiOjE3ODAzOTg2NTQsImF1ZCI6Imh0dHBzOi8vYXBpLnJlZGdpZnMuY29tIiwiYXpwIjoiMTgyM2MzMWY3ZDMtNzQ1YS02NTg5LTAwMDUtZDhlOGZlMGE0NGMyIiwiZXhwIjoxNzgwNDg1MDU0LCJzdWIiOiJjbGllbnQvMTgyM2MzMWY3ZDMtNzQ1YS02NTg5LTAwMDUtZDhlOGZlMGE0NGMyIiwic2NvcGVzIjoicmVhZCIsInZhbGlkX2FkZHIiOiIxMDMuNzYuNTkuMzMiLCJ2YWxpZF9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDguMC4wLjAgU2FmYXJpLzUzNy4zNiIsInJhdGUiOi0xLCJodHRwczovL3JlZGdpZnMuY29tL3Nlc3Npb24taWQiOiI0MTgwODEzMDE1Mzk3MjMyMzUifQ.N0HMIy5ZL4xbVADL28NKApZf_HU5c00o1pRwB2zAD7VwSfc7myj3LC5CmM1d93FJCfckLEGoIVSUoxg2lsDeMDFWwJLyU6qX-h7sliSCPc4Y3wsFRw1AKtDLw05E4j5Ka_WKmaSyAr91CnAMF3-OF6JkYnNcSbNtKLoVfkHaAZmFY4t5Zs2Qj_mxhYG42mDyTNhAZgX04wF89hsd3dqn7YyFSgcZ3GVJqQV0gGCVr7MoZn2QmM6ktjiPBc2a2aPlHt0aax6Wgd9AcJDACmSjb_IrxZBJp9KlVbfyEjjmjnXUtLZAsFcmbqpY6R6QeHBv8weENObyi0JTtfiOX8n0kA"
USERNAME = "lilijunex"

API_BASE = "https://api.redgifs.com/v2"

session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/json"
})

DOWNLOAD_DIR = Path(f"downloads/{USERNAME}")
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_media(username):
    page = 1

    while True:
        response = session.get(
            f"{API_BASE}/users/{username}/media",
            params={"page": page},
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        items = data.get("items", [])
        if not items:
            break

        yield from items
        page += 1


def download_file(url, filename):
    filepath = DOWNLOAD_DIR / filename

    if filepath.exists():
        print(f"Skipping {filename}")
        return

    print(f"Downloading {filename}")

    with session.get(url, stream=True, timeout=60) as r:
        r.raise_for_status()

        with open(filepath, "wb") as f:
            for chunk in r.iter_content(1024 * 1024):
                if chunk:
                    f.write(chunk)


def main():
    for media in get_media(USERNAME):
        download_file(
            media["download_url"],
            media["filename"]
        )

    print("Done")


if __name__ == "__main__":
    main()