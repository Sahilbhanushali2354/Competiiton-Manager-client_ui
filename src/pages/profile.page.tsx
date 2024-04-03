import { Spin, Image, Input, Button, message } from "antd";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { AtomLangauge, AtomPeopleData } from "../store/atom/atom.store";
import { PeopleDataDTO } from "../types/input.type";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { ChangeEvent, useEffect, useState } from "react";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";
import styled from "styled-components";

export const InputContainer = styled(Input)`
  width: "450px";
  color: ${({ theme }) => theme.color};
  background-color: ${({ theme }) => theme.mainbackground};

  &:hover {
    color: ${({ theme }) => theme.color};
    background-color: ${({ theme }) => theme.mainbackground};
  }
  &:focus {
    color: ${({ theme }) => theme.color};
    background-color: ${({ theme }) => theme.mainbackground};
  }

  @media (max-width: 1110px) {
    width: 250px;
  }
`;

const Profile = () => {
  useEffect(() => {
    const _userExists = poepleData.find(
      (person) => person.email == auth.currentUser?.email
    );
    setCurrentUserData(_userExists ?? {});
    
    getPeopleData();
  }, [auth.currentUser]);

  const langauge = useRecoilValue(AtomLangauge);
  const [loader, setLoader] = useState(false);
  const [poepleData, setPeopleData] = useRecoilState(AtomPeopleData);
  const [showResetButton, setShowResetButton] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<PeopleDataDTO>(
    {} as PeopleDataDTO
  );

  const translation = langauge == "hiIN" ? hindi : english;

  const getPeopleData = async () => {
    let x: PeopleDataDTO[] = [];
    const querySnapshot = await getDocs(collection(FStore, "PEOPLE"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      const data = doc.data();
      data.id = doc.id;
      x.push(data);
    });
    setPeopleData(x);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUserData({ ...currentUserData, [name]: value });
  };
  const handleUpdate = () => {
    setLoader(true);
    for (const key in currentUserData) {
      if (!currentUserData[key as keyof typeof currentUserData]) {
        setLoader(false);
        message.error(translation.fieldEmptyError);
        return;
      }
    }
    message.success(translation.profileUpdatedSuccess);
    updatedData();
    setLoader(false);
  };
  const updatedData = async () => {
    await setDoc(
      doc(FStore, "PEOPLE", currentUserData.id as string),
      currentUserData
    )
      .then(() => {
        console.log("Updated SuccessFully");
      })
      .catch((error) => console.log(error));
  };
  const handleReset = () => {
    setShowResetButton(false);
    const _userExists = poepleData.find(
      (person) => person.email == auth.currentUser?.email
    );
    setCurrentUserData(_userExists ?? {});

    getPeopleData();
  };
  return (
    <Spin spinning={loader}>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src={currentUserData.profile}
            style={{
              borderRadius: "20px",
              width: "100px",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {showResetButton && (
            <Button type="primary" onClick={handleReset}>
              {translation.undo}
            </Button>
          )}
          <span style={{ margin: "5px" }}></span>
          <Button type="primary" onClick={() => setShowResetButton(true)}>
            {translation.edit}
          </Button>
        </div>

        <div style={{ padding: "10px" }}></div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>{translation.username}</p>
            <InputContainer
              key={currentUserData.id}
              name="uname"
              value={currentUserData.uname}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>{translation.email}</p>

            <InputContainer
              key={currentUserData.id}
              name="email"
              readOnly={true}
              value={currentUserData.email}
              onClick={() => message.error("oops! You cannot Edit Email")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>{translation.contact}</p>
            <InputContainer
              key={currentUserData.id}
              value={currentUserData.contact}
              onChange={handleChange}
              name="contact"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>{translation.address}</p>
            <InputContainer
              key={currentUserData.id}
              value={currentUserData.address}
              name="address"
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ padding: "10px  " }}></div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleUpdate}>
            {translation.update}
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default Profile;
