import { useEffect } from 'react';

interface MetaTagsConfig {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export const useMetaTags = (config: MetaTagsConfig) => {
    useEffect(() => {
        const { title, description, image, url } = config;

        // Update page title
        if (title) {
            document.title = title;
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) pageTitle.textContent = title;
        }

        // Update Open Graph tags
        if (title) {
            const ogTitle = document.getElementById('og-title');
            if (ogTitle) ogTitle.setAttribute('content', title);

            const twitterTitle = document.getElementById('twitter-title');
            if (twitterTitle) twitterTitle.setAttribute('content', title);
        }

        if (description) {
            const ogDescription = document.getElementById('og-description');
            if (ogDescription) ogDescription.setAttribute('content', description);

            const twitterDescription = document.getElementById('twitter-description');
            if (twitterDescription) twitterDescription.setAttribute('content', description);
        }

        if (image) {
            const ogImage = document.getElementById('og-image');
            if (ogImage) ogImage.setAttribute('content', image);

            const twitterImage = document.getElementById('twitter-image');
            if (twitterImage) twitterImage.setAttribute('content', image);
        }

        if (url) {
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.setAttribute('content', url);

            const twitterUrl = document.querySelector('meta[property="twitter:url"]');
            if (twitterUrl) twitterUrl.setAttribute('content', url);
        }
    }, [config]);
};
