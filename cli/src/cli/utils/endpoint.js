const api = require("../api/client");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m"
};

/**
 * Get endpoint URL based on tunnel status
 * @param {number} port - Local server port
 * @returns {Promise<{endpoint: string, tunnelEnabled: boolean}>}
 */
async function getEndpoint(port) {
  const result = await api.getTunnelStatus();
  const tunnelEnabled = result.success && result.data?.enabled === true;
  const publicUrl = result.success ? result.data?.publicUrl : "";
  
  const endpoint = tunnelEnabled && publicUrl ? `${publicUrl}/v1` : `http://localhost:${port}/v1`;
  return { endpoint, tunnelEnabled };
}

async function getEndpointWithTimeout(port, timeoutMs = 1500) {
  try {
    return await Promise.race([
      getEndpoint(port),
      new Promise((resolve) => setTimeout(() => resolve({
        endpoint: `http://localhost:${port}/v1`,
        tunnelEnabled: false,
      }), timeoutMs)),
    ]);
  } catch {
    return {
      endpoint: `http://localhost:${port}/v1`,
      tunnelEnabled: false,
    };
  }
}

/**
 * Get endpoint with color formatting
 * @param {number} port - Local server port
 * @returns {Promise<string>} Colored endpoint string
 */
async function getEndpointColored(port) {
  const { endpoint, tunnelEnabled } = await getEndpointWithTimeout(port);
  return tunnelEnabled ? `${COLORS.green}${endpoint}${COLORS.reset}` : endpoint;
}

module.exports = { getEndpoint, getEndpointWithTimeout, getEndpointColored };
