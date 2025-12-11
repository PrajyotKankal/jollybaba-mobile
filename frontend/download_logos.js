const fs = require('fs');
const https = require('https');
const path = require('path');

const brands = [
    { name: 'Apple', url: 'https://logo.clearbit.com/apple.com' },
    { name: 'Samsung', url: 'https://logo.clearbit.com/samsung.com' },
    { name: 'Xiaomi', url: 'https://logo.clearbit.com/mi.com' },
    { name: 'OnePlus', url: 'https://logo.clearbit.com/oneplus.com' },
    { name: 'Google', url: 'https://logo.clearbit.com/google.com' },
    { name: 'Oppo', url: 'https://logo.clearbit.com/oppo.com' },
    { name: 'Vivo', url: 'https://logo.clearbit.com/vivo.com' },
    { name: 'Realme', url: 'https://logo.clearbit.com/realme.com' },
    { name: 'Motorola', url: 'https://logo.clearbit.com/motorola.com' },
    { name: 'Nokia', url: 'https://logo.clearbit.com/nokia.com' },
    { name: 'Nothing', url: 'https://logo.clearbit.com/nothing.tech' },
    { name: 'Redmi', url: 'https://logo.clearbit.com/mi.com' },
    { name: 'Poco', url: 'https://logo.clearbit.com/po.co' },
    { name: 'iPhone', url: 'https://logo.clearbit.com/apple.com' },
    { name: 'iQOO', url: 'https://logo.clearbit.com/iqoo.com' },
    { name: 'Lenovo', url: 'https://logo.clearbit.com/lenovo.com' },
    { name: 'Dell', url: 'https://logo.clearbit.com/dell.com' },
    { name: 'Honor', url: 'https://logo.clearbit.com/honor.com' },
    { name: 'Itel', url: 'https://logo.clearbit.com/itel-life.com' },
    { name: 'HP', url: 'https://logo.clearbit.com/hp.com' },
    { name: 'Infinix', url: 'https://logo.clearbit.com/infinixmobility.com' },
    { name: 'Narzo', url: 'https://logo.clearbit.com/realme.com' },
    { name: 'Tecno', url: 'https://logo.clearbit.com/tecno-mobile.com' },
    { name: 'Lava', url: 'https://logo.clearbit.com/lavamobiles.com' },
    { name: 'Micromax', url: 'https://logo.clearbit.com/micromaxinfo.com' },
    { name: 'Asus', url: 'https://logo.clearbit.com/asus.com' },
    { name: 'Sony', url: 'https://logo.clearbit.com/sony.com' },
    { name: 'LG', url: 'https://logo.clearbit.com/lg.com' },
    { name: 'HTC', url: 'https://logo.clearbit.com/htc.com' },
    { name: 'Huawei', url: 'https://logo.clearbit.com/huawei.com' },
];

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${dest}`);
            });
        } else {
            console.error(`Failed to download ${url}: Status ${response.statusCode}`);
            file.close();
            fs.unlink(dest, () => { }); // Delete empty file
        }
    }).on('error', (err) => {
        fs.unlink(dest, () => { });
        console.error(`Error downloading ${url}: ${err.message}`);
    });
};

if (!fs.existsSync('public/brands')) {
    fs.mkdirSync('public/brands', { recursive: true });
}

brands.forEach(brand => {
    download(brand.url, `public/brands/${brand.name.toLowerCase()}.png`);
});
