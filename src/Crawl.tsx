import React, { Fragment } from "react";

import styles from "./Crawl.module.css";

interface CrawlProps {
  title: string;
  openingCrawlText: string;
  crawl: boolean;
  onCrawlEnd: () => void;
}

export const Crawl: React.SFC<CrawlProps> = ({
  title,
  openingCrawlText: openingCrawl,
  crawl: fade,
  onCrawlEnd
}) => {
  return (
    <Fragment>
      <div id="fade" className={styles.fade} />
      <section className={styles.starWars}>
        <article
          className={fade ? styles.crawl : styles.stopCrawl}
          onAnimationEnd={onCrawlEnd}
        >
          <h1>{title}</h1>
          <pre className={styles.pre}>{openingCrawl}</pre>
        </article>
      </section>
    </Fragment>
  );
};
