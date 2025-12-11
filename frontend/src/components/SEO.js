import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    canonical,
    ogImage = "https://jollybaba.in/preview.png"
}) => {
    const siteName = "JollyBaba Mobiles";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} Pune | Best Second Hand Mobile Shop`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SEO;
