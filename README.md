Hello!

To Launch tests:

1. Install the dependencies via command: $npm install
2. To launch tests run command: $npm run test:chromium
3. To format code: $npm run prettier

To open build-in HTML report: $npm run test:report

Useful tips:

- headless: true, (to launch tests in visible browser ) //[playwright.config.js]
- reporter: [["html", { open: "on-failure" }], ["list"]] //[playwright.config.js]
