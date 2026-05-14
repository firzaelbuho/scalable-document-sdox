// content.js
// Runs when an .sdox file is opened in Chrome.

function init() {
    // Chrome wraps plain text files in a <pre> tag.
    const pre = document.querySelector('body > pre');
    
    if (!pre) {
        // If not found, maybe it's not a raw text file or already modified.
        return;
    }

    const sdoxContent = pre.textContent;

    function escapeHtmlForRaw(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    try {
        // 1. Parse the text
        const ast = window.parseSdox(sdoxContent);
        
        // 2. Render HTML
        const html = window.renderSdoxAST(ast);
        
        // 3. Setup the UI
        document.body.innerHTML = `
            <div class="sdox-extension-container">
                <div class="sdox-extension-header">
                    <span>SDOX Viewer</span>
                    <div class="sdox-view-toggle">
                        <button id="btn-formatted" class="toggle-btn active">Preview</button>
                        <button id="btn-raw" class="toggle-btn">Raw</button>
                    </div>
                </div>
                <div class="sdox-extension-content">
                    <div id="view-formatted" style="display: block;">
                        ${html}
                    </div>
                    <div id="view-raw" style="display: none;">
                        <pre class="sdox-raw-content">${escapeHtmlForRaw(sdoxContent)}</pre>
                    </div>
                </div>
            </div>
        `;
        
        // Add a class to body to ensure consistent background
        document.body.classList.add('sdox-viewer-active');

        // 4. Attach event listeners
        const btnFormatted = document.getElementById('btn-formatted');
        const btnRaw = document.getElementById('btn-raw');
        const viewFormatted = document.getElementById('view-formatted');
        const viewRaw = document.getElementById('view-raw');

        btnFormatted.addEventListener('click', () => {
            btnFormatted.classList.add('active');
            btnRaw.classList.remove('active');
            viewFormatted.style.display = 'block';
            viewRaw.style.display = 'none';
        });

        btnRaw.addEventListener('click', () => {
            btnRaw.classList.add('active');
            btnFormatted.classList.remove('active');
            viewRaw.style.display = 'block';
            viewFormatted.style.display = 'none';
        });
        
    } catch (e) {
        console.error("Failed to parse or render SDOX:", e);
        // Fallback to original text with an error banner
        const errorBanner = document.createElement('div');
        errorBanner.style.background = '#ef4444';
        errorBanner.style.color = '#fff';
        errorBanner.style.padding = '10px';
        errorBanner.style.fontFamily = 'sans-serif';
        errorBanner.textContent = "SDOX Viewer Error: " + e.message;
        document.body.prepend(errorBanner);
    }
}

// Run the initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
