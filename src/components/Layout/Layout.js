import Header from '../Header';
import styles from './Layout.module.css';

const Layout = ({ children, background }) => (
  <div className={styles.container}>
    {background && <div className="togethere-background"></div>}
    <div className="sr-root">
      <div className="sr-main">
        <Header></Header>
        {children}
      </div>
    </div>
  </div>
);

export default Layout;
