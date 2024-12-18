const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'wallets.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const wallets = data.trim().split('\n');
  let completedRequests = 0;
  let total = 0;
  let totalUnclaimed = 0;
  const checkWallet = (wallet) => {
    fetch(`https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${wallet}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Api dead');
        }
        return response.json();
      })
      .then(data => {
        console.log(`For wallet ${wallet} Total: ${data.total}, Total Unclaimed: ${data.totalUnclaimed}`);
        total += data.total;
        totalUnclaimed += + data.totalUnclaimed;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        completedRequests++; 
        if (completedRequests === wallets.length) {
          console.log('All', completedRequests, 'wallets have been checked with total of', total, 'tokens', totalUnclaimed, 'claimable! Press enter to exit...');
          process.stdin.on('data', (data) => {
            process.exit(0);
          });
        }
      });
  };

  wallets.forEach((wallet, index) => {
    setTimeout(() => {
      checkWallet(wallet.trim());
    }, index * 1000);
  });
});