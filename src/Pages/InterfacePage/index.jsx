import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import React, { useState } from 'react';
import { useEffect } from 'react';

import { Container, SectionOne, SectionTwo, SituationOfEquipments, BackupOfEquipments, Title, EquipmentsList,ResetButton } from './styles';

export const InterfacePage = () => { 
  const [equipments, setEquipments] = useState([])

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
  
  const equipamentoLiberado = equipments.filter(equipments => equipments.situation == "Liberado")
      equipamentoLiberado.forEach(equipments => {
      })
  const equipamentosNãoLiberados = equipments.filter(equipments => equipments.situation == "não-liberado")
      equipamentosNãoLiberados.forEach(equipments => {
        console.log("nAO LIBERADO",equipamentosNãoLiberados)
      })
  const equipamentosEmLiberação = equipments.filter(equipments => equipments.situation == "em-liberação")
      equipamentosNãoLiberados.forEach(equipments => {
        console.log("EM LIBERAÇÃO",equipamentosEmLiberação)
      })
  const equipamentosReservas = equipments.filter(equipments => equipments.situation == "reserva")
      equipamentosReservas.forEach(equipments => {
        console.log("RESERVA",equipamentosReservas)
      })    
      
       async function handleDelete (id){
        const docRef = doc(db,"Equipamentos",id)
        await deleteDoc(docRef)
      }
  return (
    <>
      <Container>
        <SectionOne>
          <SituationOfEquipments>
            <Title>
              <h1>Liberados</h1>
            </Title>
            <EquipmentsList >
              {equipamentoLiberado.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                    <button onClick={() => handleDelete(item.id)}>X</button>
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>
          <SituationOfEquipments>
            <Title>
              <h1>Em Liberação</h1>
            </Title>  
            <EquipmentsList>
            {equipamentosEmLiberação.map((item,index) => (
                <>  
                <li key={index}>
                  {item.name}
                  <button onClick={() => handleDelete(item.id)}>X</button>
                 </li>
                </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>
          <SituationOfEquipments>
            <Title>
              <h1>Não Liberados</h1>
            </Title>
            <EquipmentsList>
            {equipamentosNãoLiberados.map((item,index) => (
              <>
                <li key={index}>
                  {item.name}
                  <button onClick={() => handleDelete(item.id)}>X</button>
                </li>
              </>
              ))}
            </EquipmentsList>
          </SituationOfEquipments>
        </SectionOne>
        <SectionTwo>
          <BackupOfEquipments>
            <Title><h1>Spreader's Reservas</h1></Title>
            <EquipmentsList >
              {equipamentosReservas.map((item,index) => (
                 <>  
                  <li key={index}>
                    {item.name}
                    <button onClick={() => handleDelete(item.id)}>X</button>
                  </li>
                 </>
              ))}
            </EquipmentsList>
          </BackupOfEquipments>
{/*           <BackupOfEquipments>
            <ResetButton>alo</ResetButton>
          </BackupOfEquipments> */}
        </SectionTwo>
      </Container>
    </>
  );

}


export default InterfacePage;


