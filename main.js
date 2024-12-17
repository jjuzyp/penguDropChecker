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

  const processWallet = (wallet, index) => {
    fetch(`https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${wallet}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Api dead');
        }
        return response.json();
      })
      .then(data => {
        const total = data.total;
        const totalUnclaimed = data.totalUnclaimed;
        console.log(`For wallet ${wallet} Total: ${total}, Total Unclaimed: ${totalUnclaimed}`);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        completedRequests++; 
        if (completedRequests === wallets.length) {
          console.log('Press enter to exit...');
          process.stdin.on('data', (data) => {
            process.exit(0);
          });
        }
      });
  };

  wallets.forEach((wallet, index) => {
    setTimeout(() => {
      processWallet(wallet.trim(), index);
    }, index * 3000);
  });
});