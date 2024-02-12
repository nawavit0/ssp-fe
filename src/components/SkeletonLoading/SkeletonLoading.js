import React from 'react';
import styles from './SkeletonLoading.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
const SkeletonLoading = props => {
  const { isShow, type, isCompleted } = props;

  const Skeleton = () => {
    switch (type) {
      case 'banner':
        return (
          <div
            className={cx(styles.Container, {
              [styles.isShow]: isShow,
            })}
          >
            <div className={styles.LineContent} />
          </div>
        );
      case 'content':
        return (
          <div
            className={cx(styles.Container, styles.Content, {
              [styles.isShow]: isShow,
            })}
          >
            <div className={styles.ContentContainer}>
              <div className={styles.Paragraph} />
              <div className={styles.Paragraph} />
              <div className={styles.Paragraph} />
            </div>
          </div>
        );
      case 'product':
        return (
          <div
            className={cx(styles.Container, styles.Product, {
              [styles.isShow]: isShow,
            })}
          >
            <div className={styles.ProductContent}>
              <div className={styles.Wrapper}>
                <div className={styles.Image} />
                <div className={styles.WrapperDetail}>
                  <div className={styles.Detail} />
                  <div className={styles.Detail} />
                  <div className={styles.Detail} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'filter':
        return (
          <div
            className={cx(styles.filterBoxContent, {
              [styles.isShow]: isShow,
            })}
          >
            <div className={styles.LineContent} />
          </div>
        );
      default:
        return null;
    }
  };

  if (isCompleted) {
    return null;
  }
  return Skeleton();
};

export default withStyles(styles)(SkeletonLoading);
