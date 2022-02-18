import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Footer from "../components/atoms/Footer";
import Heading from "../components/atoms/Heading";
import Header from "../components/molecules/Header";
import { RootState, CollectionInterface, editCollection } from "../store";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

const StyledWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 200px;
  padding: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  height: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.dark};
`;

const StyledInlineBox = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    font-weight: inherit;
  }
`;

const StyledButton = styled(Button)<{ right?: boolean; left?: boolean }>`
  position: fixed;
  top: 30px;

  ${({ right }) =>
    right &&
    css`
      right: 30px;
    `};

  ${({ left }) =>
    left &&
    css`
      left: 30px;
    `}
`;

const StyledEditButton = styled.button`
  width: 80px;
  height: 50px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ theme }) => theme.colors.dark};
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 15px;

  &:hover {
    cursor: pointer;
    color: black;
    border: 1px solid black;
    border-radius: 15px;
  }
`;

const StyledGrid = styled.div`
  margin: 10px auto 50px auto;
  width: 80%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 250px));
  justify-items: center;
  justify-content: center;
  gap: 50px;
  padding: 25px;
`;

const StyledLanguageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 20px;
  gap: 30%;
  background-color: ${({ theme }) => theme.colors.brown};

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
    transition: transform ease-in-out 0.5s;
  }
`;

const StyledSubmitButton = styled(Button)`
  align-self: center;
  width: 100px;
  height: 60px;
  margin-top: 20px;
`;

const StyledInput = styled(Input)`
  height: 50px;
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const CollectionView = () => {
  const [isCollectionEdit, setCollectionEdit] = useState(false);
  const [editData, setEditData] = useState({ name: "", learn_language: "" });
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rootReducer = useSelector((state: RootState) => state.rootReducer);
  const [collectionData, setCollectionData] = useState<CollectionInterface>({
    id: null,
    native_language: "",
    learn_language: "",
    name: "",
    language_card: []
  });

  useEffect(() => {
    if (Object.keys(rootReducer).length) {
      const [data] = rootReducer.collections.filter(
        (item: any) => item.id.toString() === id
      );
      if (data) {
        setCollectionData(data);
      }
    }
  }, [rootReducer]);

  const redirectManageView = () => {
    navigate("/manage");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "collectionName") {
      setEditData({ ...editData, name: e.target.value });
    } else if (e.target.name === "collectionLanguage") {
      setEditData({ ...editData, learn_language: e.target.value });
    }
  };

  const handleCollectionEdit = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (id) {
      const validId = parseInt(id, 10);

      dispatch(
        editCollection(
          {
            id: validId,
            editData
          },
          token
        )
      );
    }

    setCollectionEdit(false);
  };

  return (
    <>
      <Header />
      <>
        {collectionData.id !== null ? (
          <>
            <StyledWrapper>
              <StyledEditButton
                onClick={() => setCollectionEdit(!isCollectionEdit)}
              >
                {isCollectionEdit ? (
                  <>
                    <i
                      className="fas fa-window-close"
                      style={{ margin: "0 5px 0 0" }}
                    />{" "}
                    Anuluj
                  </>
                ) : (
                  <>
                    <i className="fas fa-pen" style={{ margin: "0 5px 0 0" }} />
                    Edytuj
                  </>
                )}
              </StyledEditButton>
              <Heading>Collection view</Heading>
              <StyledInlineBox>
                <h3>Language you learn: </h3>
                {isCollectionEdit ? (
                  <StyledInput
                    type="text"
                    placeholder={collectionData.learn_language}
                    name="collectionLanguage"
                    onChange={handleInputChange}
                  />
                ) : (
                  <h3>{collectionData.learn_language}</h3>
                )}
              </StyledInlineBox>
              <StyledInlineBox>
                <h3>Collection name: </h3>
                {isCollectionEdit ? (
                  <StyledInput
                    type="text"
                    placeholder={collectionData.name}
                    name="collectionName"
                    onChange={handleInputChange}
                  />
                ) : (
                  <h3>{collectionData.name}</h3>
                )}
              </StyledInlineBox>
              {isCollectionEdit && (
                <StyledSubmitButton secondary onClick={handleCollectionEdit}>
                  Save
                </StyledSubmitButton>
              )}
            </StyledWrapper>
            <StyledGrid>
              <StyledLanguageCard />
            </StyledGrid>
          </>
        ) : (
          <StyledWrapper>
            <Heading>Nothing there!</Heading>
          </StyledWrapper>
        )}
      </>
      <StyledButton secondary left big onClick={redirectManageView}>
        Back to choose collection
        <br />
        <i className="fas fa-long-arrow-alt-left" />
      </StyledButton>
      <StyledButton right>
        Create new language card
        <br />
        <i className="fas fa-plus" />
      </StyledButton>
      <Footer />
    </>
  );
};

export default CollectionView;
