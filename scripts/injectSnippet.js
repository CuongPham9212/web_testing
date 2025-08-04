function injectScript() {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Get the is_web parameter
  const isWeb = urlParams.get('is_web');
  
  if (isWeb === 'true') {
    // Handle Optimizely snippet injection
    injectOptimizelySnippet();
  } else if (isWeb === 'false') {
    // Handle Edge client injection
    injectEdgeClientScript();
  } else {
    console.log('No valid is_web parameter found. Script injection skipped.');
  }
}

function injectOptimizelySnippet() {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Get required parameters
  const useS3 = urlParams.get('use_s3') === 'true';
  const s3Bucket = urlParams.get('optimizely_s3_bucket');
  const accountId = urlParams.get('account_id');
  
  // Validate parameters
  if (!s3Bucket || !accountId) {
    console.error('Missing required parameters for Optimizely snippet injection');
    return;
  }
  
  // First, inject the Content-Type meta tag
  const metaElement = document.createElement('meta');
  metaElement.httpEquiv = 'Content-Type';
  metaElement.content = 'text/html; charset=utf-8';
  document.head.appendChild(metaElement);
  console.log('Content-Type meta tag injected');
  
  // Construct the script URL
  let scriptUrl = `https://${s3Bucket}`;
  if (useS3) {
    scriptUrl += '.s3';
  }
  scriptUrl += `.amazonaws.com/js/${accountId}.js`;
  
  // Create script element
  const scriptElement = document.createElement('script');
  scriptElement.src = scriptUrl;
  scriptElement.type = 'text/javascript';
  
  // Inject into document head
  document.head.appendChild(scriptElement);
  
  console.log(`Optimizely snippet injected: ${scriptUrl}`);
}

function injectEdgeClientScript() {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Get required parameters
  const accountId = urlParams.get('account_id');
  const projectId = urlParams.get('project_id');
  
  // Validate parameters
  if (!accountId || !projectId) {
    console.error('Missing required parameters for Edge client injection');
    return;
  }
  
  // First, inject the Content-Type meta tag
  const metaElement = document.createElement('meta');
  metaElement.httpEquiv = 'Content-Type';
  metaElement.content = 'text/html; charset=utf-8';
  document.head.appendChild(metaElement);
  console.log('Content-Type meta tag injected');
  
  // Get current URL without query parameters
  const currentUrl = window.location.origin + window.location.pathname;
  
  // Construct the script URL
  const scriptUrl = `https://ocdndns.com/master_latest/edge-client/v1/${accountId}/${projectId}?url=${encodeURIComponent(currentUrl)}`;
  
  // Create script element
  const scriptElement = document.createElement('script');
  scriptElement.src = scriptUrl;
  scriptElement.type = 'text/javascript';
  
  // Inject into document head
  document.head.appendChild(scriptElement);
  
  console.log(`Edge client script injected: ${scriptUrl}`);
}

// Execute the function when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectScript);
} else {
  injectScript();
}
