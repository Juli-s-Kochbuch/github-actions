const fs = require('fs');
const { execSync } = require('child_process');

function setOutput(name, value) {
    require('fs').appendFileSync(
        process.env.GITHUB_OUTPUT,
        `${name}=${value}\n`
    );
    console.log(`${name}=${value}`);
}



// current version
const themeDataPath = `./theme.json`;

if (!fs.existsSync(themeDataPath)) {
    console.error(`theme.json not found at ${themeDataPath}`);
    process.exit(1);
}

const currentContent = fs.readFileSync(themeDataPath, 'utf8');
const current = JSON.parse(currentContent);

if (!current.version) {
    console.error('No version found in theme.json');
    process.exit(1);
}

// previous version
let previous = { version: '' };

try {
    const oldContent = execSync(`git show HEAD~1:theme.json`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
    });
    previous = JSON.parse(oldContent);
} catch (e) {
    console.error("git show failed:", e.message);
}


console.log(`previous version=${previous.version}`);
const changed = current.version !== previous.version;



setOutput("slug", current.slug);
setOutput("version", current.version);
setOutput("changed", changed);