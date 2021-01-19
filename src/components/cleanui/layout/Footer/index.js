import React from 'react'
import style from './style.module.scss'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <a
          href="https://nds.co.id"
          target="_blank"
          rel="noopener noreferrer"
          className={style.logo}
        >
          NDS
          <span />
        </a>
        <br />
        <p className="mb-0">
          Copyright © Nusantara Duta Solusindo
        </p>
      </div>
    </div>
  )
}

export default Footer
