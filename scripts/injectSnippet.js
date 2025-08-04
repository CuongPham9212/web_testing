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
  let scriptUrl = `//${s3Bucket}`;
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

// Execute the function when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectOptimizelySnippet);
} else {
  injectOptimizelySnippet();
}
