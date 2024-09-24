import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {Image, SectionOne, SectionTwo, SituationOfEquipments, BackupOfEquipments, Title, EquipmentsList,SectionThree,Main, SupportEquipaments,Footer} from './styles';
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
          situation:doc.data().situation,
          created: doc.data().created,
        })
      })
      setEquipments(list) 
    })
  },[])
  
  const equipamentoLiberado = equipments.filter(equipments => equipments.situation == "Liberado")

  const equipamentosNãoLiberados = equipments.filter(equipments => equipments.situation == "Não-liberado")
  
  const equipamentosEmLiberação = equipments.filter(equipments => equipments.situation == "Em-liberação")
 
  const equipamentosReservas = equipments.filter(equipments => equipments.situation == "Reserva")
  
  const equipamentosProximoDia = equipments.filter(equipments => equipments.situation == "Proximo-dia")
  
  const equipamentosDateTime = equipments.filter(equipments => equipments.situation == "Data")

  const equipamentosDeApoio = equipments.filter(equipments => equipments.situation == "Apoio")

  return (
    <>
    <Image>
      <Main> 
        <Burger/> 

        <SectionOne>
          <SituationOfEquipments style={{
                borderColor:"green"
              }}>
            <Title>
              <h1>Liberados</h1>
            </Title>
            <EquipmentsList>
              {equipamentoLiberado.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>

          <SupportEquipaments>
            <Title> 
              <h1 style={{
                fontSize:"24px"
              }}> Equipamentos de Apoio </h1> 
            </Title>
            <EquipmentsList>
              {equipamentosDeApoio.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                  </li>
                 </>
              ))}
            </EquipmentsList>

          </SupportEquipaments>
        </SectionOne>

        <SectionTwo>
              <SituationOfEquipments 
              style={{
                borderColor:"yellow"
              }}>
            <Title>
              <h1>Em Liberação</h1>
            </Title>
            <EquipmentsList>
              {equipamentosEmLiberação.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>
           
           <BackupOfEquipments>
            <Title>
              <h1>Spreader's Reservas</h1>
              </Title>
            <EquipmentsList >
              {equipamentosReservas.map((item,index) => (
                 <>  
                  <li key={index}>
                    <p>{item.name}</p>
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </BackupOfEquipments> 

           <BackupOfEquipments>
            <Title>
              <h1 style={{
                fontSize:"28px"
              }} >Programação do Dia &rarr; </h1>
              {equipamentosDateTime.map((item,index) => (
                 <> 
                 <div key={index}>
                    <span>{item.name}</span>
                 </div>
                 </>
              ))}
            </Title>
            <EquipmentsList>
                {equipamentosProximoDia.map((item,index) => (
                 <> 
                 <div>
                  <li key={index}>
                    <p>{item.name}</p>
                  </li>
                 </div>
                 </>
              ))}
            </EquipmentsList>
          </BackupOfEquipments> 
        </SectionTwo>

        <SectionThree>
              <SituationOfEquipments style={{
                borderColor:"red"
              }}>
            <Title>
              <h1>Não Liberados</h1>
            </Title>
            <EquipmentsList>
              {equipamentosNãoLiberados.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>
        </SectionThree>
        </Main>
      </Image>
    </>
  );

}


export default PreviewPage;


