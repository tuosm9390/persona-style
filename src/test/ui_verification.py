from playwright.sync_api import sync_playwright
import os

def test_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        # 1. Home Page
        print("Checking Home Page...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='doc/results/test_home.png')
        
        # 2. Analyze Page
        print("Checking Analyze Page...")
        page.goto('http://localhost:3000/analyze')
        page.wait_for_load_state('networkidle')
        # Check for mode selector
        photo_btn = page.get_by_text("사진 업로드")
        text_btn = page.get_by_text("텍스트 설명")
        print(f"Analyze modes visible: Photo={photo_btn.is_visible()}, Text={text_btn.is_visible()}")
        page.screenshot(path='doc/results/test_analyze.png')
        
        # 3. Login Page
        print("Checking Login Page...")
        page.goto('http://localhost:3000/login')
        page.wait_for_load_state('networkidle')
        # Check for Google button
        google_btn = page.get_by_text("Google로 계속하기")
        github_btn = page.get_by_text("Github으로 계속하기")
        print(f"Social login buttons: Google={google_btn.is_visible()}, Github={github_btn.is_visible()}")
        page.screenshot(path='doc/results/test_login.png')
        
        browser.close()

if __name__ == "__main__":
    if not os.path.exists('doc/results'):
        os.makedirs('doc/results')
    test_pages()
