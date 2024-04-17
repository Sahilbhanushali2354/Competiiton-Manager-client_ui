import { Spin, Image, Input, Button, message } from "antd";
import { useRecoilValue } from "recoil";
import { AtomLangauge } from "../store/atom/atom.store";
import { NewAccountDTO } from "../types/input.type";
import { auth } from "../common/config/firebase/firebase.config";
import { ChangeEvent, useEffect, useState } from "react";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";
import styled from "styled-components";

export const InputContainer = styled(Input)`
  width: 250px;
  max-width: 250px;
  color: ${({ theme }) => theme.color};
  background-color: ${({ theme }) => theme.mainbackground};

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: none;
  }

  .ant-input {
    color: ${({ theme }) => theme.color};
    background-color: ${({ theme }) => theme.mainbackground};
    border-color: ${({ theme }) => theme.borderColor};

    &:hover,
    &:focus {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: none;
    }
  }

  .ant-input-affix-wrapper {
    background-color: ${({ theme }) => theme.mainbackground};
    border-color: ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.color};

    .ant-input-prefix,
    .ant-input-suffix {
      color: ${({ theme }) => theme.color};
    }
  }
`;
export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

export const ErrorMessageWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const Profile = () => {
  const langauge = useRecoilValue(AtomLangauge);
  const [loader, setLoader] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState<NewAccountDTO>(
    {} as NewAccountDTO
  );
  const [currentUserData, setCurrentUserData] = useState<NewAccountDTO>(
    {} as NewAccountDTO
  );
  const [initialCurrentUserData, setInitialCurrentUserData] =
    useState<NewAccountDTO>({} as NewAccountDTO);

  useEffect(() => {
    getCurrentPeopleData();
    if (currentUserData) {
      setInitialCurrentUserData(currentUserData);
    }
  }, [auth.currentUser]);

  const translation = langauge == "hiIN" ? hindi : english;

  const isCurrentUserDataChanged = () => {
    const currentUserDataChanged =
      JSON.stringify(initialCurrentUserData) !==
      JSON.stringify(currentUserData);
    return currentUserDataChanged;
  };

  const isUpdateDisabled = !isCurrentUserDataChanged();
  // setShowResetButton(isUpdateDisabled);
  const getCurrentPeopleData = async () => {
    // setLoader(true);
    // const q = query(
    //   collection(FStore, "PEOPLE"),
    //   where("email", "==", localStorage.getItem("auth"))
    // );
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   let x = {} as NewAccountDTO;
    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     data.id = doc.id;
    //     x = data as NewAccountDTO;
    //   });
    const x = localStorage.getItem("Authdetails");
    const _currentUserData = x ? JSON.parse(x) : null;

    setCurrentUserData(_currentUserData as NewAccountDTO);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUserData((prevData) => ({ ...prevData, [name]: value }));
    setShowResetButton(true);
  
    const generateErrorMessage = (fieldName: string, fieldValue: string) => {
      if (!fieldValue) {
        return `Enter ${fieldName}`;
      } else {
        return "";
      }
    };
  
    const updatedErrorMessage = { ...errorMessage };
  
    if (name === "uname" || name === "email" || name === "contact" || name === "address") {
      updatedErrorMessage[name] = generateErrorMessage(name, value);
    }
  
    setErrorMessage(updatedErrorMessage);
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
    // await setDoc(
    //   doc(FStore, "PEOPLE", currentUserData.id as string),
    //   currentUserData
    // )
    //   .then(() => {
    //     console.log("Updated Successfully");
    //     setShowResetButton(false);
    //   })
    //   .catch((error) => console.log(error));

    // const docRef = doc(FStore, "PEOPLE", currentUserData.id as string);
    // const unsubscribe = onSnapshot(docRef, (doc) => {
    //   if (doc.exists()) {
    //     setCurrentUserData(doc.data());
    //   } else {
    //   }
    // });

    // return () => unsubscribe();
    localStorage.setItem("Authdetails", JSON.stringify(currentUserData));
  };
  const handleReset = () => {
    setShowResetButton(false);
    setErrorMessage({});

    getCurrentPeopleData();
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

        <div style={{ padding: "10px" }}></div>
        <InputWrapper>
          <p style={{ width: "100px" }}>{translation.username}</p>
          <div>
            <div>
              <InputContainer
                key={currentUserData.id}
                name="uname"
                value={currentUserData.uname}
                onChange={handleChange}
              />
              <div style={{ color: "red", fontSize: "12px" }}>
                {errorMessage.uname}
              </div>
            </div>
          </div>
        </InputWrapper>

        <InputWrapper>
          <p style={{ width: "100px" }}>{translation.email}</p>
          <div>
            <InputContainer
              key={currentUserData.id}
              name="email"
              disabled={true}
              value={currentUserData.email}
            />
          </div>
        </InputWrapper>

        <InputWrapper>
          <p style={{ width: "100px" }}>{translation.contact}</p>
          <div>
            <InputContainer
              key={currentUserData.id}
              value={currentUserData.contact}
              onChange={handleChange}
              name="contact"
            />
            <div style={{ color: "red", fontSize: "12px" }}>
              {errorMessage.contact}
            </div>
          </div>
        </InputWrapper>

        <InputWrapper>
          <p style={{ width: "100px" }}>{translation.address}</p>
          <div>
            <InputContainer
              key={currentUserData.id}
              value={currentUserData.address}
              name="address"
              onChange={handleChange}
            />
            <div style={{ color: "red", fontSize: "12px" }}>
              {errorMessage.address}
            </div>
          </div>
        </InputWrapper>
      </div>
      <div style={{ padding: "10px  " }}></div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {showResetButton && (
          <Button type="primary" onClick={handleReset}>
            {translation.reset}
          </Button>
        )}
        <div style={{ padding: "3px" }}></div>
        <Button
          disabled={isUpdateDisabled ? true : false}
          type="primary"
          onClick={handleUpdate}
        >
          {translation.update}
        </Button>
      </div>
    </Spin>
  );
};

export default Profile;
