import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

// Change this when a custom domain is added (also in public/sitemap.xml and public/robots.txt).
export const SITE_URL = 'https://fawateer-masr.pages.dev';

export interface PageSeo {
  title: string;
  description: string;
  /** Path starting with "/", for example "/gas". */
  path: string;
  /** Social sharing image in /public, for example "/og-gas.png". */
  image: string;
  imageAlt: string;
}

/**
 * Sets the tags search engines and WhatsApp/Facebook read, per page.
 * Pages are prerendered, so these end up in the static HTML of each page.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setPage(page: PageSeo): void {
    const url = SITE_URL + page.path;
    const imageUrl = SITE_URL + page.image;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: page.imageAlt });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
