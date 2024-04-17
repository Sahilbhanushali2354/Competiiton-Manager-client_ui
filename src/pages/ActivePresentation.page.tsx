import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
  message,
  Dropdown,
  MenuProps,
  Space,
  Input,
} from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ActiveParticipantDTO,
  CompetitionDTO,
  PresentationDTO,
  PresentationErrorDTO,
  RoundsDataDTO,
} from "../types/input.type";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AtomAllPresentations,
  AtomCurrentPresentation,
  AtomLangauge,
} from "../store/atom/atom.store";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { InputContainer } from "./profile.page";
import { useNavigate, useParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";

const Presentation = () => {
  const { id } = useParams();

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
  const [allActiveData, setallActiveData] = useState<ActiveParticipantDTO[]>(
    [] as ActiveParticipantDTO[]
  );
  const [selectedCompetition, setSelectedCompetition] =
    useState<CompetitionDTO>({} as CompetitionDTO);
  const [activeRound, setActiveRound] = useState<RoundsDataDTO>(
    {} as RoundsDataDTO
  );
  const [activeRoundData, setActiveRoundData] = useState<RoundsDataDTO>(
    {} as RoundsDataDTO
  );
  const [initialPresentationData, setInitialPresentationData] =
    useState<PresentationDTO>({} as PresentationDTO);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    getActiveRoundDetail();
  }, []);
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

  useEffect(() => {
    if (activeRound !== undefined) {
      getActiveCompetition();
    }
  }, [activeRound]);
  useEffect(() => {
    if (window.location.href.split("/").includes("edit"))
      setInitialPresentationData(currentPresentationData);
  }, [id]);

  const isPresentationDataChanged = () => {
    if (!newFile.name) {
      return false;
    }
    const presentationDataChanged =
      JSON.stringify(initialPresentationData) !==
      JSON.stringify(currentPresentationData);

    const fileChanged = newFile.name !== currentPresentationData.fileName;

    return presentationDataChanged || fileChanged;
  };
  const isUpdateDisabled = !isPresentationDataChanged();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let val = e.target.value;
    const value = val.replace(/\s{2,}/g, " ");
    setCurrentPresentationData({ ...currentPresentationData, [name]: value });

    const generateErrorMessage = (fieldName: string, fieldValue: string) => {
      if (!fieldValue) {
        return `Enter ${fieldName}`;
      } else {
        return "";
      }
    };

    const updatedErrorMessage: any = { ...errorMessage };
    updatedErrorMessage[name] = generateErrorMessage(name, value);
    setErrorMessage(updatedErrorMessage);
  };

  const uplaodChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList.slice(-1);

    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setLoader(true);
      console.log(file.type);
      let _error = { ...errorMessage };

      if (!file) {
        setLoader(false);
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
        setLoader(false);
        setErrorMessage({
          ...errorMessage,
          ["presentation"]: "You can only upload PDF, XLS, and Word files!",
        });

        setNewFile({} as UploadFile);
        return false;
      }
      setErrorMessage({ ...errorMessage, ["presentation"]: "" });
      setNewFile(file);
      setLoader(false);
      return false;
    },
    onChange: uplaodChange,
    onRemove: () => {
      setNewFile({} as any);
    },
    multiple: false,
  };

  const addData = async () => {
    setLoader(true);
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
        const auth1 = localStorage.getItem("Authdetails");
        const authDetails = auth1 && JSON.parse(auth1);
        const name = authDetails ? authDetails.uname : "";
        return {
          ...currentPresentationData,
          competitionData: selectedCompetition,
          roundData: { id: activeRoundData.id, label: activeRoundData.label },
          fileName: newFile.name,
          time: snapshot.metadata.timeCreated,
          email: auth.currentUser?.email,
          name: name,
        };
      })
      .catch((e) => {
        setLoader(false);
        message.error(e);
      })
      .then((presentationData) => {
        setLoader(true);
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
        });
      })
      .catch((err) => {
        setLoader(false);
        message.error(err);
      });
  };
  const handleSave = () => {
    setLoader(true);
    let _error = { ...errorMessage };
    if (
      !currentPresentationData.topic ||
      !currentPresentationData.category ||
      !currentPresentationData.description ||
      !newFile.name ||
      !selectedCompetition.cname?.length
    ) {
      setLoader(false);
      _error = {
        ...errorMessage,
        topic: !currentPresentationData.topic ? translation.errors.topic : "",
        description: !currentPresentationData.description
          ? translation.errors.description
          : "",
        category: !currentPresentationData.category
          ? translation.errors.category
          : "",
        presentation: !newFile.name ? translation.errors.presentation : "",
        competitionName: !selectedCompetition.cname?.length
          ? translation.errors.competition
          : "",
      };
      setErrorMessage(_error);
    } else {
      const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!allowedFileTypes.includes(newFile.type as any)) {
        setLoader(false);
        setErrorMessage({
          ...errorMessage,
          ["presentation"]: "You can only upload PDF, XLS, and Word files!",
        });
        return;
      }

      setLoader(true);
      if (!currentPresentationData.id) {
        addData();
      } else {
        updateData();
      }
    }
  };

  const updateData = async () => {
    setLoader(true);
    if (!currentPresentationData.id) {
      setLoader(false);
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
          )
            .then(async (url) => {
              setLoader(true);
              await setDoc(
                doc(
                  FStore,
                  "PRESENTATION",
                  currentPresentationData.id as string
                ),
                {
                  ...presentationData,
                  url,
                }
              );
              navigate("/allpresentation");
            })
            .catch((error) => {
              setLoader(false);
              message.error(error);
            })
        )
        .catch((error) => {
          setLoader(false);
          message.error(error);
        });
    } else {
      setLoader(true);
      await setDoc(
        doc(FStore, "PRESENTATION", currentPresentationData.id as string),
        currentPresentationData
      );
      message.success("Presentation Detail Updated SuccessFully");
      navigate("/allpresentation");
    }
  };
  const handleItemClick = (competitionData: CompetitionDTO) => {
    setSelectedCompetition(competitionData);
    const activeRoundData: any = allActiveData.find(
      (competition: any) =>
        competition.selectedCompetition.cname === competitionData.cname
    );
    setActiveRoundData(activeRoundData?.roundsData ?? {});
    setErrorMessage({ ...errorMessage, competitionName: "" });
  };
  const items: MenuProps["items"] = allActiveData.map((round: any) => ({
    key: round.id,
    label: round.selectedCompetition.cname,
    onClick: () => {
      handleItemClick(round.selectedCompetition);
      console.log(round.selectedCompetition);

      // if (activeRoundData) {
      //   setActiveRound(activeRoundData.roundsData);
      // }
    },
  }));
  const getActiveRoundDetail = () => {
    setLoader(true);
    const q = query(collection(FStore, "DEFAULT"));
    return onSnapshot(q, async (snapshot) => {
      snapshot.forEach((doc) => {
        const _data = doc.data();
        console.log(_data);

        _data.id = doc.id;

        setActiveRound((prev) => ({
          ...prev,
          [doc.id]: {
            roundsData: _data.activeRound,
            selectedCompetition: _data.selectedCompetition,
          },
        }));
      });
      setLoader(false);
    });
  };

  const getActiveCompetition = () => {
    const active: any[] = [] as any[];
    Object.entries(activeRound).forEach(([competitionID, roundData]) => {
      const roundID = roundData.roundsData.id;
      const docRef: any = doc(
        FStore,
        "COMPETITION",
        competitionID,
        roundID,
        "PARTICIPANTS"
      );
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot: any) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const _data = data?.DATA ?? [];

            const _isFound = _data.some((email: ActiveParticipantDTO) => {
              return email.email === auth.currentUser?.email;
            });

            if (_isFound) {
              active.push(roundData);
              setallActiveData(active);
            }
          }
        },
        (error: string | any) => {
          setLoader(false);
          message.error(error);
        }
      );

      return () => unsubscribe();
    });
  };

  return (
    <Spin spinning={loader}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{translation.uploadpresentation}</span>
          <Upload {...props} name="presentation" fileList={fileList}>
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
        <div style={{ padding: "10px" }}></div>
        <div>
          <p>
            {window.location.href.split("/").includes("edit") ||
            selectedCompetition.cname
              ? translation.selectedcompetition
              : translation.selectcompetition}
          </p>
          <Dropdown
            disabled={window.location.href.split("/").includes("edit")}
            menu={{ items: items }}
            trigger={["click"]}
          >
            <Space style={{ cursor: "pointer" }}>
              {window.location.href.split("/").includes("edit") &&
              AllPresentations.length
                ? currentPresentationData.competitionData.cname
                : selectedCompetition && selectedCompetition.cname?.length
                ? selectedCompetition.cname
                : translation.selectcompetition}
              <DownOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.location.href.split("/").includes("edit")
                    ? message.error(`Sorry Can't edit Competition Detail`)
                    : null;
                }}
              />
            </Space>
          </Dropdown>
          {(window.location.href.split("/").includes("edit") &&
            AllPresentations.length &&
            currentPresentationData.roundData.label.length) ||
          selectedCompetition.cname?.length ? (
            <span style={{ margin: "15px" }}>
              <Space>{translation.activeround}</Space>
              <span style={{ margin: "5px" }}></span>
              <Input
                style={{
                  width: "88px",
                  textAlign: "center",
                }}
                readOnly={true}
                value={
                  window.location.href.split("/").includes("edit")
                    ? currentPresentationData.roundData?.label
                    : activeRoundData.label
                }
              />
            </span>
          ) : null}
        </div>
        <div style={{ padding: "5px" }}></div>
        <div style={{ color: "red", fontSize: "13px" }}>
          {errorMessage.competitionName}
        </div>
        <div style={{ padding: "15px" }}></div>

        <div>
          {!currentPresentationData.id?.length ? (
            <Button onClick={handleSave} type="primary">
              {translation.save}
            </Button>
          ) : (
            <Button
              disabled={isUpdateDisabled ? true : false}
              onClick={handleSave}
              type="primary"
            >
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
