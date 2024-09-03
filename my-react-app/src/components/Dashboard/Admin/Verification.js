import React from 'react';
import {useState, useEffect} from 'react';
import { GetSellers, DoVerifySeller } from '../../services/AdminService';
import './Verification.css'
import {ReactComponent as Personimage} from '../../../images/personimage.svg'
import {ReactComponent as AddressImage} from '../../../images/addressimage.svg'
import {ReactComponent as Dateimage} from '../../../images/dateimage.svg'
import {ReactComponent as EmailImage} from '../../../images/emailsvg.svg'
import {ReactComponent as Verifiedicon} from '../../../images/verifiedIcon.svg'
import {ReactComponent as DeniedIcon} from '../../../images/deniedIcon.svg'
import {ReactComponent as PendingIcon} from '../../../images/PendingIcon.svg'

export default function Verification(){

    const [userData, setuserData] = useState([])

    const getuserdata = async() =>{
        const resp = await GetSellers();
        setuserData(resp)
    }

    useEffect(()=>{
        getuserdata()
    },[])

    const doverifyuser = async(userid, verifed) =>{
      const resp = await DoVerifySeller(userid, verifed);
      if(resp==="True"){
        const updatedItems = userData.map(item => {
          if (item.id === userid) {
            return { ...item, verify: "True" };
          }
          return item;
        });
        setuserData(updatedItems)
      }
      else if(resp==="Denied"){
        const updatedItems = userData.map(item => {
          if (item.id === userid) {
            return { ...item, verify: null };
          }
          return item;
        });
        setuserData(updatedItems)
      }
  }

    const handleVerify = (userid, verifed) => {
        doverifyuser(userid, verifed)
    }

    return(
      <div className="container_verification">
        {userData.map(user => (
          <div className="card_verification" key={user.id}>
            <div className="picture_verification">
               <img height={130} width={130} src={`data:image/png;base64,${user.picture}`} />
            </div>
            <div className="maintitle">{user.name + " " + user.surname}</div>
            <div className="user-data">
              <div className="userdatarow"><Personimage className='verification-icon' fill="#fbc85c"/> {user.username}</div>
              <div className="userdatarow"><EmailImage className='verification-icon' fill="#fbc85c"/> {user.email}</div>
              <div className="userdatarow"><Dateimage className='verification-icon' fill="#fbc85c"/> {user.dateOfBirth}</div>
              <div className="userdatarow"><AddressImage className='verification-icon' fill="#fbc85c"/> {user.address}</div>
              <div className="userdatarow">{(user.verify === "False" && (<><PendingIcon className='verification-icon' fill="#fbc85c"/> Pending</>)) || (user.verify === "True" && (<><Verifiedicon className='verification-icon' fill="#fbc85c"/> Verified</>)) || (user.verify === null && (<><DeniedIcon className='verification-icon' fill="#fbc85c"/> Denied</>))}</div>
            </div>
            <div className="social_verification">
            {user.verify === "False" && <button className="buttonVerification" onClick={() => handleVerify(user.id, true)}>Verify</button>}
            {user.verify === "False" && <button className="buttonVerification" onClick={() => handleVerify(user.id, false)}>Deny</button>}  
            </div>
          </div>
        ))}
      </div>
    );
}