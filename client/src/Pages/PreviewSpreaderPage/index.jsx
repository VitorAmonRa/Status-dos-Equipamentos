import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {Image, SectionOne, SituationOfEquipments, Title, EquipmentsList,Main,Footer} from './styles';
import { Burger } from '../../Components/Burger'

export const PreviewPage = () => { 

  const [equipments, setEquipments] = useState([])
  const navigate = useNavigate();
  
  useEffect(() => {
    const equipmentsRef = collection(db,"Equipamentos")
    const queryRef = query(equipmentsRef,orderBy("created","asc"))
    
    const unsub = onSnapshot(queryRef,(snapshot) => {
      let list = []
      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name:doc.data().name,
          situation:doc.data().situation
        })
      })
      setEquipments(list) 
    })
  },[])
  
  const RT01 = equipments.filter(equipments => equipments.situation == "RT01")
  const RT02 = equipments.filter(equipments => equipments.situation == "RT02")
  const RT03 = equipments.filter(equipments => equipments.situation == "RT03")
  const RT04 = equipments.filter(equipments => equipments.situation == "RT04")
  const RT05 = equipments.filter(equipments => equipments.situation == "RT05")
  const RT06 = equipments.filter(equipments => equipments.situation == "RT06")
  const RT07 = equipments.filter(equipments => equipments.situation == "RT07")
  const RT08 = equipments.filter(equipments => equipments.situation == "RT08")
  const RT09 = equipments.filter(equipments => equipments.situation == "RT09")
  const RT10 = equipments.filter(equipments => equipments.situation == "RT10")
  const RT11 = equipments.filter(equipments => equipments.situation == "RT11")
  const RT12 = equipments.filter(equipments => equipments.situation == "RT12")
  const RT13 = equipments.filter(equipments => equipments.situation == "RT13")
  const RT14 = equipments.filter(equipments => equipments.situation == "RT14")
  const RT15 = equipments.filter(equipments => equipments.situation == "RT15")
  const RT16 = equipments.filter(equipments => equipments.situation == "RT16")
  const RT17 = equipments.filter(equipments => equipments.situation == "RT17")
  const RT18 = equipments.filter(equipments => equipments.situation == "RT18")
  const ST01 = equipments.filter(equipments => equipments.situation == "ST01")
  const ST02 = equipments.filter(equipments => equipments.situation == "ST02")
  const ST03 = equipments.filter(equipments => equipments.situation == "ST03")
  const ST04 = equipments.filter(equipments => equipments.situation == "ST04")
  const ST05 = equipments.filter(equipments => equipments.situation == "ST05")
  const ST06 = equipments.filter(equipments => equipments.situation == "ST06")
  return (
    <>
    <Image>
      <Main> 
        <Burger/> 

        <SectionOne>
          <SituationOfEquipments style={{
                borderColor:"#0ceaf1 "
              }}>
            <Title>
              <h1 style={{
                borderBottom:"2px solid #0ceaf1"
              }} >Localização dos Spreaders</h1>
            </Title>
            <EquipmentsList>
              <div><li>
              {RT01.map((item,index) => (
                 <>  
                  <li key={index}>
                 <span> RT01 </span> = {item.name}
                  </li>
                 </>
              ))}
              </li></div>

                <div><li>
              {RT02.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT02 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT03.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT03 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT04.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT04 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>
                
                <div><li>
              {RT05.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT05 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT06.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT06 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT07.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT07 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT08.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT08 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT09.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT09 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT10.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT10 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT11.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT11 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT12.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT12 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT13.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT13 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT14.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT14 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT15.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT15 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT16.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT16 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {RT17.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT17 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {RT18.map((item,index) => (
                 <>  
                  <li key={index}>
                  RT18 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {ST01.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST01 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {ST02.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST02 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {ST03.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST03 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {ST04.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST04 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li> 
              {ST05.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST05 ={item.name}
                  </li>
                 </>
              ))}
                </li></div>

                <div><li>
              {ST06.map((item,index) => (
                 <>  
                  <li key={index}>
                  ST06 = {item.name}
                  </li>
                 </>
              ))}
                </li></div>

            </EquipmentsList>
          </SituationOfEquipments>
        </SectionOne>
        </Main>
      </Image>
    </>
  );

}


export default PreviewPage;


