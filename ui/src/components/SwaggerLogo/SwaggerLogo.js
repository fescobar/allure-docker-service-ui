import React from 'react';

import logo from '../../assets/images/swagger.png';
import styles from './SwaggerLogo.module.css';

const swaggerLogo = (props) => (
    <div className={styles.Logo} style={{height: props.height}}>
        <img src={logo} alt="swagger" />
    </div>
);

export default swaggerLogo;