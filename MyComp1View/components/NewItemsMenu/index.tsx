import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './index.module.less';

const NewItemsMenu: React.FC = () => {
  return (
    <div className={styles.containerSection}>
      <div className={styles.itemWrapper}>
        <div className={styles.contentBlock}>
          <img
            alt=""
            src="https://weavefox.alipay.com/assets/f82b099b-2a1d-4e6c-95da-db5d65f0fcec.png"
            className={styles.thumbnailImage}
          />
          <span className={styles.itemTitle}>New design file</span>
        </div>
      </div>
      <div className={styles.itemWrapper}>
        <div className={styles.contentBlock2}>
          <img
            alt=""
            src="https://weavefox.alipay.com/assets/8d358538-70e0-454a-b0fe-be994aeb9378.png"
            className={styles.thumbnailImage}
          />
          <span className={styles.itemTitle}>New FigJam board</span>
        </div>
      </div>
      <div className={styles.itemWrapper}>
        <div className={styles.contentBlock3}>
          <img
            alt=""
            src="https://weavefox.alipay.com/assets/065118ec-8d58-4dab-b8fd-d2b23c959a21.png"
            className={styles.highlightedImage}
          />
          <span className={styles.itemTitle}>New slide deck</span>
        </div>
      </div>
      <div className={styles.itemWrapper}>
        <div className={styles.iconWrapper}>
          <ExclamationCircleFilled className={styles.warningIcon} />
          <span className={styles.actionLabel}>Import</span>
        </div>
      </div>
    </div>
  );
};

export default NewItemsMenu;
