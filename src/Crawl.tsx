import React, { Fragment } from "react";

import styles from "./Crawl.module.css";

interface CrawlProps {
  title: string;
  crawl: string;
  fade: boolean;
  onFadeEnd: () => void;
}

//   <div className={styles.fade} />

export const Crawl: React.SFC<CrawlProps> = ({
  title,
  crawl,
  fade,
  onFadeEnd
}) => {
  return (
    <Fragment>
      <div id="fade" className={styles.fade} />
      <section className={styles.starWars}>
        <article
          className={fade ? styles.crawl : ""}
          onAnimationEnd={onFadeEnd}
        >
          <h1>{title}</h1>
          <pre className={styles.pre}>{crawl}</pre>
        </article>
      </section>
    </Fragment>
  );
};
