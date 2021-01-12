import fetch from 'node-fetch';

export const wakeUp = () => {
    setTimeout(async () => {
        try {
            return await fetch('https://rank-api.herokuapp.com').then(() => process.stdout.write('App persisted for another 25 mins.'));
        } catch (err) {
            return console.log('Error fetching the page.');
        } finally {
            wakeUp();
        }
    }, 1.5e+6);
};