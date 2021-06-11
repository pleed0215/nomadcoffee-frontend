import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { LayoutContainer } from "../../components/LayoutContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Map, Marker } from "react-kakao-maps";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { CreateShop, CreateShopVariables } from "../../codegen/CreateShop";
import { useHistory } from "react-router";
import { ButtonInactivable } from "../../components/ButtonInactivable";
import {
  MUTATION_ADD_CATEGORY_TO_SHOP,
  MUTATION_CREATE_SHOP,
  MUTATION_DELETE_SHOP,
  MUTATION_EDIT_SHOP,
  MUTATION_REMOVE_CATEGORY_FROM_SHOP,
  MUTATION_REMOVE_PHOTO_FROM_SHOP,
  QUERY_SHOPS,
} from "../../apollo/queries";
import { AllShop } from "../../codegen/AllShop";
import { DeleteShop, DeleteShopVariables } from "../../codegen/DeleteShop";
import { EditShop, EditShopVariables } from "../../codegen/EditShop";
import {
  RemoveCategory,
  RemoveCategoryVariables,
} from "../../codegen/RemoveCategory";
import { AddCategory, AddCategoryVariables } from "../../codegen/AddCategory";
import { RemovePhoto, RemovePhotoVariables } from "../../codegen/RemovePhoto";

const Container = styled(LayoutContainer)`
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const StepText = styled.h4`
  font-size: 1.4rem;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.color.primary};
  border-radius: 4px;
  width: 100%;
  padding: 0.5rem;
  outline: none;
  margin-bottom: 8px;
`;

const Categories = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const CategoryContainer = styled.div`
  width: 100px;
  height: 30px;
  padding: 3px 5px;
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.secondary};
  font-size: 1rem;
  border-radius: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const CategoryText = styled.span`
  margin-right: 5px;
`;

const CategoryIcon = styled.div`
  width: 10px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
`;

const AddressText = styled.span`
  margin-top: 8px;
  font-size: 1rem;
`;

const MapContainer = styled.div`
  width: 100%;
  margin-top: 8px;
  height: 200px;
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 8px;
  overflow: hidden;
`;

const PhotosContainer = styled.div`
  width: 100%;
  padding: 10px;
  height: 150px;
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const PhotoFile = styled.div`
  width: 130px;
  height: 130px;
  background-size: cover;
  background-position: center center;
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const UploadedPhotoFile = styled.div`
  width: 130px;
  height: 130px;
  background-size: cover;
  background-position: center center;
  &:not(:last-child) {
    margin-right: 10px;
  }
  position: relative;
`;

const PhotoDeleteIcon = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  color: ${(props) => props.theme.color.secondary};
  background-color: ${(props) => props.theme.background.secondary};
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: yellowgreen;
  }
`;

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
  margin-top: 4px;
`;

const DeleteButton = styled.button`
  background-color: #ce3333;
  color: white;
  width: 100%;
  height: 32px;
  border-radius: 3px;
`;

type AddOrEditProp = {
  editing?: boolean;
  shop?: AllShop;
};

type AddressInfo = {
  address: string;
  lat: number;
  lng: number;
};

type ImageInfo = {
  localUrl: string | ArrayBuffer | null;
};

export const AddOrEditPage: React.FC<AddOrEditProp> = ({
  editing = false,
  shop,
}) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [fileList, setFileList] = useState<FileList>();
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [realAddress, setRealAddress] = useState<AddressInfo>();
  const [categories, setCategories] = useState<string[]>([]);
  const [daumPost, setDaumPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errMessages, setErrMessages] = useState<string[]>([]);

  const [createShop] = useMutation<CreateShop, CreateShopVariables>(
    MUTATION_CREATE_SHOP,
    {
      onCompleted: (data) => {
        setLoading(false);
        if (data.createCoffeeShop.ok) {
          alert("카페가 성공적으로 만들어졌습니다.");
          history.push("/");
        } else {
          alert("카페 만들기 실패");
        }
      },
    }
  );
  const [deleteShop] = useMutation<DeleteShop, DeleteShopVariables>(
    MUTATION_DELETE_SHOP,
    {
      onCompleted: (data) => {
        setLoading(false);
        if (data.deleteCoffeeShop.ok) {
          alert("삭제 되었습니다.");
          history.push("/");
        } else {
          alert("삭제 실패");
        }
      },
      refetchQueries: [
        {
          query: QUERY_SHOPS,
        },
      ],
    }
  );
  const [editShop] = useMutation<EditShop, EditShopVariables>(
    MUTATION_EDIT_SHOP,
    {
      onCompleted: (data) => {
        if (data.editCoffeeShop.ok) {
          alert("변경사항이 저장되었습니다.");
          history.push("/");
        } else {
          alert("업데이트에 실패했습니다.");
        }
      },
    }
  );

  const [addCategory] = useMutation<AddCategory, AddCategoryVariables>(
    MUTATION_ADD_CATEGORY_TO_SHOP
  );
  const [removeCategory] = useMutation<RemoveCategory, RemoveCategoryVariables>(
    MUTATION_REMOVE_CATEGORY_FROM_SHOP
  );

  const [deletePhoto] = useMutation<RemovePhoto, RemovePhotoVariables>(
    MUTATION_REMOVE_PHOTO_FROM_SHOP
  );

  //@ts-ignore
  const kakao = window.kakao;
  //@ts-ignore
  const daum = window.daum;

  const checkValid = () => {
    const messages: string[] = [];
    if (name.length < 4 || name.length > 20) {
      messages.push("카페 이름은 4글자에서 20글자 사이로 해주세요.");
    }
    if (categories.length === 0) {
      messages.push("카테고리는 적어도 한 개가 있어야 합니다.");
    }
    if (!realAddress) {
      messages.push("주소 정보가 필요합니다. 확인해주세요.");
    }

    if (editing) {
      if (shop?.photos?.length === 0 && (!fileList || fileList?.length === 0)) {
        messages.push("사진은 적어도 한 장 포함해주세요");
      }
    } else {
      if (!fileList || fileList.length === 0) {
        messages.push("사진은 적어도 한 장 포함해주세요");
      }
    }
    if (fileList && fileList.length > 5) {
      messages.push("사진이 너무 많습니다. 5장까지 가능합니다.");
    }
    setErrMessages(messages);
    return !(messages.length > 0);
  };

  const onCreateClick = () => {
    setErrMessages([]);
    if (checkValid()) {
      setLoading(true);
      console.log("editing", editing);
      if (editing) {
        editShop({
          // @ts-ignore
          variables: {
            id: shop?.id!,
            name,
            address: realAddress?.address!,
            lat: +realAddress?.lat!,
            lng: +realAddress?.lng!,
            ...(fileList && fileList.length > 0 && { photos: fileList }),
          },
        });
      } else {
        createShop({
          variables: {
            name,
            address: realAddress?.address!,
            lat: +realAddress?.lat!,
            lng: +realAddress?.lng!,
            //@ts-ignore
            photos: fileList!,
            categories,
          },
          refetchQueries: [
            {
              query: QUERY_SHOPS,
            },
          ],
        });
      }
    }
  };

  const onDeleteShopClick = () => {
    if (shop && shop.id) {
      if (window.confirm("정말 삭제하십니까?")) {
        deleteShop({
          variables: {
            id: shop.id,
          },
          update: (cache, result) => {
            if (result.data?.deleteCoffeeShop.ok) {
              cache.modify({
                id: `ROOT_QUERY`,
                fields: {
                  seeCoffeeShops: (prev: any) => {
                    const safePrev = prev ? prev.slice(0) : [];
                    const index = safePrev.findIndex(
                      (shop: any) => shop.__ref === `CoffeeShop:${shop.id}`
                    );
                    if (index !== -1) {
                      safePrev.splice(index, 1);
                    }
                    return safePrev;
                  },
                },
              });
            }
          },
        });
      }
    }
  };

  const onUploadedPhotoDeleteClick =
    (photoId: number) => (_: React.MouseEvent) => {
      if (editing && shop?.id) {
        if (window.confirm("정말 삭제 합니까?")) {
          deletePhoto({
            variables: {
              id: shop.id,
              photoId,
            },
            update: (cache, result) => {
              if (result.data?.removePhotoFromShop.ok) {
                cache.modify({
                  id: `CoffeeShop:${shop?.id}`,
                  fields: {
                    photos: (prev: any) => {
                      const safePrev = prev ? prev.slice(0) : [];
                      console.log(safePrev);
                      const index = safePrev.map(
                        (photo: any) =>
                          photo.__ref === `CoffeeShopPhoto:${photoId}`
                      );

                      if (index !== -1) {
                        safePrev.splice(index, 1);
                      }
                      console.log(safePrev);
                      return safePrev;
                    },
                  },
                });
              }
            },
          });
        }
      }
    };

  const onChange =
    (type: "name" | "address" | "category" | "photos") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value || "";
      switch (type) {
        case "name":
          setName(value);
          break;
        case "category":
          setCategory(value);
          break;
        case "address":
          setAddress(value);
          break;
        case "photos":
          if (e.target.files) {
            setImages([]);
            setFileList(e.target.files);
          }
          break;
      }
    };

  const onKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (editing && shop?.id) {
        addCategory({
          variables: {
            id: shop?.id,
            categories: [category],
          },
          update: (caches, result) => {
            caches.modify({
              id: `CoffeeShop:${shop?.id}`,
              fields: {
                categories: (prev: any) => {
                  if (result.data?.addCategoriesToShop.ok) {
                    const safePrev = prev ? prev.slice(0) : [];
                    const index = safePrev.findIndex(
                      (cat: any) => cat.__ref === `Category:${category}`
                    );
                    if (index === -1) {
                      return [...safePrev, category];
                    } else {
                      return safePrev;
                    }
                  }
                },
              },
            });
          },
        });
      }
      if (categories.findIndex((value) => value === category) === -1) {
        setCategories((prev) => [...prev, category]);
        setCategory("");
      }
    }
  };

  const onKeyPressAddress: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      const width = 500,
        height = 600;
      daumPost.open({
        left: window.screen.width / 2 - width / 2,
        top: window.screen.height / 2 - height / 2,
        q: address,
        popupName: "postcodePopup",
      });
    }
  };

  const onRevmoeCategory = (text: string) => (e: React.MouseEvent) => {
    if (editing) {
      removeCategory({
        variables: {
          id: shop?.id!,
          slug: text,
        },
        update: (caches, result) => {
          caches.modify({
            id: `CoffeeShop:${shop?.id}`,
            fields: {
              categories: (prev: any) => {
                if (result.data?.removeCategoryFromShop.ok) {
                  const safePrev = prev ? prev.slice(0) : [];
                  const index = safePrev.findIndex(
                    (cat: any) => cat.__ref === `Category:${text}`
                  );
                  if (index !== -1) {
                    safePrev.splice(index, 1);
                  }
                  return [...safePrev];
                }
              },
            },
          });
        },
      });
    }
    const index = categories.findIndex((value) => value === text);
    if (index !== -1) {
      categories.splice(index, 1);
      setCategories([...categories]);
    }
  };

  useEffect(() => {
    if (daum && kakao) {
      setDaumPost(
        //@ts-ignore
        new daum.Postcode({
          width: 500,
          height: 600,
          oncomplete: (data: any) => {
            const geocoder = new kakao.maps.services.Geocoder();
            const callback = (result: any, status: any) => {
              if (status === kakao.maps.services.Status.OK) {
                if (result.length > 0) {
                  setRealAddress({
                    address: result[0].road_address.address_name,
                    lat: result[0].y,
                    lng: result[0].x,
                  });
                } else {
                  setRealAddress({
                    address,
                    lat: 35.8151848,
                    lng: 128.5272922,
                  });
                }
              }
            };

            //@ts-ignore
            geocoder.addressSearch(data.address, callback);
          },
        })
      );
    }
  }, [daum, kakao, address]);

  useEffect(() => {
    if (editing && shop) {
      setName(shop.name);
      setRealAddress({
        address: shop.address!,
        lat: +shop.lat!,
        lng: +shop.lng!,
      });
      setAddress(shop.address!);
      const cats = shop?.categories?.map((cat) => cat?.slug!);
      if (cats) {
        setCategories(cats);
      }
    }
  }, [editing, shop]);

  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const length = fileList.length > 5 ? 5 : fileList.length;
      for (let i = 0; i < length; i++) {
        const file = fileList[i];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          setImages((prev) => [...prev, { localUrl: reader.result }]);
        };
      }
    }
  }, [fileList]);

  return (
    <Container>
      <HelmetOnlyTitle title={editing ? "카페 편집" : "카페 만들기"} />
      <Title>커피샵 만들기</Title>
      <StepText>1. 이름 정하기</StepText>
      <Input
        type="text"
        name="name"
        value={name}
        onChange={onChange("name")}
        placeholder="카페 이름을 입력해주세요"
      />
      <StepText>2. 카테고리 정하기</StepText>
      <Input
        type="text"
        name="category"
        value={category}
        onChange={onChange("category")}
        onKeyDown={onKeyPress}
        placeholder="카페의 카테고리를 입력하시고 엔터를 눌러주세요. 여러 개 입력 가능합니다."
      />
      <Categories>
        {categories.map((cat) => (
          <CategoryContainer key={cat}>
            <CategoryText>{cat}</CategoryText>
            {categories.length > 1 && (
              <CategoryIcon onClick={onRevmoeCategory(cat)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </CategoryIcon>
            )}
          </CategoryContainer>
        ))}
      </Categories>
      <StepText>3. 주소 입력하기</StepText>
      <Input
        type="text"
        name="address"
        value={address}
        onChange={onChange("address")}
        onKeyPress={onKeyPressAddress}
        placeholder="주소를 입력하고 엔터를 눌러주세요."
      />
      {realAddress && (
        <>
          <AddressText>
            주소: {realAddress.address}, 위치: {realAddress.lat} /{" "}
            {realAddress.lng}
          </AddressText>
          <MapContainer>
            <Map
              options={{
                center: new kakao.maps.LatLng(realAddress.lat, realAddress.lng),
              }}
            >
              <Marker
                options={{
                  position: new kakao.maps.LatLng(
                    realAddress.lat,
                    realAddress.lng
                  ),
                }}
              />
            </Map>
          </MapContainer>
        </>
      )}
      <StepText>4. 사진 업로드하기</StepText>
      <Input
        type="file"
        name="photos"
        multiple
        accept="image/jpeg, image/jpg"
        onChange={onChange("photos")}
      />
      <PhotosContainer>
        {images.length > 0 &&
          images.map((image, index) => (
            <PhotoFile
              key={`Photo:${index}`}
              style={{ backgroundImage: `url(${image.localUrl})` }}
            />
          ))}
      </PhotosContainer>
      {editing && shop?.photos && shop.photos.length > 0 && (
        <>
          <span>업로드 된 이미지</span>
          <PhotosContainer>
            {shop.photos.map((image, index) => (
              <UploadedPhotoFile
                key={`Photo:${image?.id}`}
                style={{ backgroundImage: `url(${image?.url})` }}
              >
                {shop.photos && shop.photos.length > 1 && (
                  <PhotoDeleteIcon
                    onClick={onUploadedPhotoDeleteClick(image?.id!)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </PhotoDeleteIcon>
                )}
              </UploadedPhotoFile>
            ))}
          </PhotosContainer>
        </>
      )}

      <div style={{ marginTop: 8, marginBottom: 8, display: "flex" }}>
        <ButtonInactivable loading={loading} isActivate onClick={onCreateClick}>
          {editing ? "저장하기" : "만들기"}
        </ButtonInactivable>
        {editing && shop && (
          <div style={{ marginLeft: 16, width: "100%" }}>
            <DeleteButton onClick={onDeleteShopClick}>삭제하기</DeleteButton>
          </div>
        )}
      </div>
      <div style={{ marginTop: 8, marginBottom: 8 }} />
      {errMessages.length > 0 &&
        errMessages.map((error) => <ErrorMsg key={error}>{error}</ErrorMsg>)}
    </Container>
  );
};
