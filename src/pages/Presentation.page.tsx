import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
  message,
  notification,
} from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { PresentationDTO, PresentationErrorDTO } from "../types/input.type";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AtomAllPresentations,
  AtomCurrentPresentation,
  AtomLangauge,
} from "../store/atom/atom.store";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { InputContainer } from "./profile.page";
import { useNavigate, useParams } from "react-router-dom";

const Presentation = () => {
  const { id } = useParams();
  console.log("presentation Page", id);

  const [currentPresentationData, setCurrentPresentationData] = useRecoilState(
    AtomCurrentPresentation
  );

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [newFile, setNewFile] = useState<UploadFile>({} as UploadFile);
  const AllPresentations = useRecoilValue(AtomAllPresentations);
  const langauge = useRecoilValue(AtomLangauge);
  const translation = langauge == "hiIN" ? hindi : english;
  const [errorMessage, setErrorMessage] = useState<PresentationErrorDTO>(
    {} as PresentationErrorDTO
  );

  useEffect(() => {
    if (
      !AllPresentations.length &&
      window.location.href.split("/").includes("edit")
    ) {
      return navigate("/allpresentation");
    }
    const _currentUser = AllPresentations.find(
      (currenUser) => currenUser.id == id
    );
    setCurrentPresentationData(_currentUser ?? ({} as PresentationDTO));
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPresentationData({ ...currentPresentationData, [name]: value });

    let _error = { ...errorMessage };
    if (name === "topic" || name === "category" || name === "description")
      _error = {
        ...errorMessage,
        topic: name === "topic" && !value ? translation.errors.topic : "",
        category:
          name === "category" && !value ? translation.errors.category : "",
        description:
          name === "description" && !value
            ? translation.errors.description
            : "",
      };
    setErrorMessage(_error);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      console.log(file.type);
      let _error = { ...errorMessage };

      if (!file) {
        setErrorMessage({
          ..._error,
          presentation: "Upload Your Presentation",
        });
        return false;
      }

      const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!allowedFileTypes.includes(file.type)) {
        message.error("You can only upload PDF, XLS, and Word files!");
        return false;
      }

      setNewFile(file);
      return false;
    },
    onRemove: () => {
      setNewFile({} as any);
    },
    multiple: false,
  };

  const addData = async () => {
    debugger;
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `folder1/${auth.currentUser?.email}/${newFile.name}`
    );
    const metadata = {
      contentType: newFile.type,
    };
    uploadBytes(storageRef, newFile as any, metadata)
      .then((snapshot) => {
        setLoader(true);
        return {
          ...currentPresentationData,
          fileName: newFile.name,
          time: snapshot.metadata.timeCreated,
          email: auth.currentUser?.email,
        };
      })
      .catch((e) => {
        setLoader(false);
        console.log(e);
      })
      .then((presentationData) =>
        getDownloadURL(
          ref(storage, `folder1/${auth.currentUser?.email}/${newFile.name}`)
        ).then(async (url) => {
          console.log(presentationData);
          await addDoc(collection(FStore, "PRESENTATION"), {
            ...presentationData,
            url,
          });
          message.success("Presentation Detail Added SuccessFully");
          navigate("/allpresentation");
        })
      )
      .catch((err) => {
        setLoader(false);
        notification.open({ message: err, type: "error" });
      });
  };

  const handleSave = () => {
    debugger;
    let _error = { ...errorMessage };
    if (!currentPresentationData.topic || !currentPresentationData.category) {
      _error = {
        ...errorMessage,
        topic: !currentPresentationData.topic ? translation.errors.topic : "",
        description: !currentPresentationData.description
          ? translation.errors.description
          : "",

        category: !currentPresentationData.category
          ? translation.errors.category
          : "",
      };
      setErrorMessage(_error);
    } else {
      setLoader(true);
      if (!currentPresentationData.id) {
        addData();
      } else {
        updateData();
      }
    }
  };

  console.log(currentPresentationData.fileName);
  const updateData = async () => {
    debugger;
    if (!currentPresentationData.id) {
      console.error("Presentation ID is not defined");
      return;
    }

    const storage = getStorage();
    if (newFile.name) {
      const storageRef = ref(
        storage,
        `folder1/${auth.currentUser?.email}/${newFile.name}`
      );
      const metadata = {
        contentType: newFile.type,
      };
      uploadBytes(storageRef, newFile as any, metadata)
        .then((snapshot) => {
          setLoader(true);
          return {
            ...currentPresentationData,
            fileName: newFile.name,
            time: snapshot.metadata.timeCreated,
            email: auth.currentUser?.email,
          };
        })
        .catch((e) => {
          setLoader(false);
          console.log(e);
        })
        .then((presentationData) =>
          getDownloadURL(
            ref(storage, `folder1/${auth.currentUser?.email}/${newFile.name}`)
          ).then(async (url) => {
            console.log(presentationData);
            await setDoc(
              doc(FStore, "PRESENTATION", currentPresentationData.id as string),
              {
                ...presentationData,
                url,
              }
            );
            setLoader(false);
          })
        )
        .catch((err) => {
          setLoader(false);
          notification.open({ message: err, type: "error" });
        });
    } else {
      // If no new file is selected, update the presentation data without uploading a new file
      setLoader(true);

      console.log({ currentPresentationData });

      await setDoc(
        doc(FStore, "PRESENTATION", currentPresentationData.id as string),
        currentPresentationData
      );
      message.success("Presentation Detail Updated SuccessFully");
      navigate("/allpresentation");
    }
  };

  return (
    <Spin spinning={loader}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{translation.uploadpresentation}</span>
          <Upload {...props} name="presentation">
            <Button icon={<UploadOutlined />}>{translation.upload}</Button>
          </Upload>
        </div>

        <div
          style={{
            color: "red",
            fontSize: "13px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>{errorMessage.presentation}</div>
        </div>
        <div style={{ padding: "5px" }}></div>
        <p>{translation.topicname}</p>
        <InputContainer
          name="topic"
          onChange={handleInputChange}
          value={currentPresentationData.topic}
        ></InputContainer>
        <div style={{ color: "red", fontSize: "13px" }}>
          {errorMessage.topic}
        </div>
        <div style={{ padding: "5px" }}></div>
        <p>{translation.category}</p>
        <InputContainer
          name="category"
          value={currentPresentationData.category}
          onChange={handleInputChange}
        ></InputContainer>
        <div style={{ color: "red", fontSize: "13px" }}>
          <div>{errorMessage.category}</div>
        </div>
        <div style={{ padding: "5px" }}></div>
        <p>{translation.description}</p>
        <InputContainer
          name="description"
          value={currentPresentationData.description}
          onChange={handleInputChange}
        ></InputContainer>
        <div style={{ color: "red", fontSize: "13px" }}>
          {errorMessage.description}
        </div>
        <div style={{ padding: "15px" }}></div>

        <div>
          {!currentPresentationData.id?.length ? (
            <Button onClick={handleSave} type="primary">
              {translation.save}
            </Button>
          ) : (
            <Button onClick={handleSave} type="primary">
              {translation.update}
            </Button>
          )}
          {!currentPresentationData.fileName
            ?.length ? null : !currentPresentationData.fileName?.includes(
              "pdf"
            ) ? (
            <>
              <span style={{ margin: "10px" }}></span>
              <Button
                style={{ background: "green" }}
                onClick={() => {
                  currentPresentationData.url
                    ? window.open(currentPresentationData.url)
                    : null;
                }}
              >
                {translation.downloadfile}
              </Button>
              <span>{currentPresentationData.fileName}</span>
            </>
          ) : null}

          <span style={{ margin: "10px" }}></span>

          {currentPresentationData.fileName?.includes("pdf") ? (
            <>
              {" "}
              <Button
                style={{ background: "green" }}
                type="primary"
                onClick={() => {
                  currentPresentationData.url
                    ? window.open(currentPresentationData.url)
                    : null;
                }}
              >
                {translation.viewfile}
              </Button>
              <span>{currentPresentationData.fileName}</span>
            </>
          ) : null}
          <span style={{ margin: "10px" }}></span>
          <Button type="primary" onClick={() => navigate("/allpresentation")}>
            {translation.backtopresentation}
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default Presentation;
