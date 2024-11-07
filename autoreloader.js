// pings the server every 30 seconds to check if the file has been modified
// reloads the page if it has

window.autoreloader = {
    shouldReload: false,
    noConnection: false,
};

(()=>{
    const timeout = 20000;
    const wait = 30000;
    const ignore = ['fonts.googleapis.com','cdnjs.cloudflare.com','cdn.jsdelivr.net']
    // find all files that are loaded by the page
    // using Preformance.getEntriesByType('resource')
    const reloadable = Array.from(performance.getEntriesByType('resource')).map(({ name }) => ({ src: name }));
    reloadable.push({ src: location.href });
    // remove files that should be ignored
    for (const reload of reloadable) {
        for (const url of ignore) {
            if (reload.src.includes(url)) {
                console.log('ignoring', reload);
                reloadable.splice(reloadable.indexOf(reload), 1);
            }
        }
    }
    console.log(reloadable);    
    
    const startTime = Date.now();
    
    // check each file for changes
    const checkForChanges = async () => {
        for (const file of reloadable) {
            try {
                const response = await fetch(file.src || file.href, { cache: 'no-store', method: 'HEAD', timeout: 5000 });
                const lastModified = response.headers.get('last-modified');
                console.log('%s', file.src, lastModified);
                window.autoreloader.noConnection = false;
                if (lastModified && new Date(lastModified).getTime() > startTime) {
                    window.autoreloader.shouldReload = true;
                    location.reload();
                }
            }
            catch (e) {
                console.error(e);
                autoreloader.noConnection = true;
            }
        }
    };
    
    
    
    
    // check for changes at least every 30 seconds
    requestIdleCallback(async function check() {
        await checkForChanges();
        setTimeout(() => requestIdleCallback(check, { timeout: timeout }), wait);
    }, { timeout: timeout });
})();