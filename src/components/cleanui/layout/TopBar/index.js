import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import style from './style.module.scss'

const TopBar = () => {
  return (
    <div className={style.topbar}>
      <div className="mr-auto">
        {' '}
      </div>
      <div className="mr-4 d-none d-sm-block">
        <LanguageSwitcher />
      </div>
      <div className="">
        <UserMenu />
      </div>
    </div>
  )
}

export default TopBar
