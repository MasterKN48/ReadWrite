import React from 'react'

import { Twitter,Facebook,Mail,Whatsapp,Reddit,Linkedin,Pinterest } from 'react-social-sharing';

const Share = (props) => {
    const url = window.location.href;
    const {title}=props;
    const shareText = title;
    const styles = {
      background: '#0E2F56'
    };
    
  return (
    <div>
      <div>
        <Twitter
          solid small
          link={url} 
          label={shareText}
          style={styles}
        />
        <Facebook solid small style={styles} link="http://sharingbuttons.io"/>
        <Mail solid small link={url} style={styles} subject={`ReadWrite: ${shareText}`}/>
        <Pinterest solid small message={`ReadWrite: ${shareText}`} link={url}/>
        <Linkedin solid small message={`ReadWrite: ${shareText}`} link={url}/>
        <Reddit solid small link="http://sharingbuttons.io"/>
        <Whatsapp solid small message={`ReadWrite: ${shareText}`} link={url}/>
      </div>
    </div>
  )

}

export default Share;
