import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styled, { css } from "styled-components";
import { MUTATION_LOGIN } from "../../apollo/queries";

import { EditProfile, EditProfileVariables } from "../../codegen/EditProfile";
import { Login, LoginVariables } from "../../codegen/Login";
import { SeeMe_me } from "../../codegen/SeeMe";

import { ButtonInactivable } from "../../components/ButtonInactivable";
import { ControlledInput } from "../../components/ControlledInput";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { LayoutContainer } from "../../components/LayoutContainer";
import { PageLoader } from "../../components/Loader";
import { useMe } from "../../hooks/useMe";
import { EMAIL_REGEX } from "../../utils";

interface ProfileForm {
  username: string;
  email: string;
  name: string;
  location: string;
  githubUsername: string;
}

interface PasswordForm {
  current: string;
  password: string;
  check: string;
}

const MUTATION_EDIT_PROFILE = gql`
  mutation EditProfile(
    $id: Int!
    $username: String
    $email: String
    $password: String
    $name: String
    $location: String
    $githubUsername: String
  ) {
    editProfile(
      id: $id
      username: $username
      email: $email
      password: $password
      name: $name
      location: $location
      githubUsername: $githubUsername
    ) {
      ok
      error
    }
  }
`;

const Container = styled(LayoutContainer)`
  background-color: ${(props) => props.theme.background.primary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 50vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  width: 300px;
  min-height: 50vh;
  border: 1px solid ${(props) => props.theme.color.border};
  border-right: none;
`;

const TabItem = styled.div<{ isActive?: boolean }>`
  padding: 10px;
  text-align: center;
  ${(props) =>
    props.isActive
      ? css`
          border-left: 2px solid ${props.theme.color.link};
          background-color: ${props.theme.background.secondary};
          color: ${props.theme.color.secondary};
        `
      : css`
          background-color: ${props.theme.background.primary};
          color: ${props.theme.color.primary};
        `};
  cursor: pointer;
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  border-left: none;
  background-color: ${(props) => props.theme.background.secondary};
  min-height: 50vh;
  padding: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
`;

const PasswordEdit: React.FC<{ me: SeeMe_me }> = ({ me }) => {
  const { control, getValues, handleSubmit, formState, setError } =
    useForm<PasswordForm>({
      mode: "onChange",
    });

  const [loading, setLoading] = useState(false);
  const [updateProfile] = useMutation<EditProfile, EditProfileVariables>(
    MUTATION_EDIT_PROFILE,
    {
      onCompleted: (data) => {
        setLoading(false);
        if (data.editProfile.ok) {
          window.alert("패스워드가 변경 되었습니다.");
        } else {
          window.alert(`패스워드 변경 실패: ${data.editProfile.error}`);
        }
      },
    }
  );
  const [login] = useMutation<Login, LoginVariables>(MUTATION_LOGIN);
  const onValid = async (data: PasswordForm) => {
    setLoading(true);
    const { data: loginResult } = await login({
      variables: { email: me.email, password: data.current },
    });

    if (loginResult?.login.ok) {
      updateProfile({
        variables: {
          id: me.id,
          password: data.password,
        },
      });
    } else {
      setError("current", { message: "현재 패스워드가 일치하지 않습니다." });
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <HelmetOnlyTitle title="Update Profile" />
      <InputContainer>
        <ControlledInput
          control={control}
          name="current"
          label="현재 패스워드"
          rules={{
            required: true,
            minLength: {
              value: 8,
              message: "8글자 이상 입력해주세요.",
            },
            maxLength: {
              value: 18,
              message: "18글자 이하로 입력해주세요.",
            },
          }}
          type="password"
          placeholder="현재 암호를 입력하세요."
        />
        <ControlledInput
          control={control}
          label="변경할 패스워드"
          rules={{
            required: true,
            minLength: {
              value: 8,
              message: "8글자 이상 입력해주세요.",
            },
            maxLength: {
              value: 18,
              message: "18글자 이하로 입력해주세요.",
            },
          }}
          name="password"
          type="password"
          placeholder="바꾸실 암호를 입력하세요."
        />

        <ControlledInput
          rules={{
            required: true,
            minLength: {
              value: 8,
              message: "8글자 이상 입력해주세요.",
            },
            maxLength: {
              value: 18,
              message: "18글자 이하로 입력해주세요.",
            },
            validate: {
              value: (value) =>
                value === getValues("password") ||
                "패스워드가 일치하지 않습니다.",
            },
          }}
          control={control}
          name="check"
          label="패스워드 확인"
          type="password"
          placeholder="암호를 확인해주세요."
        />

        <ButtonInactivable
          isActivate={formState.isValid && !formState.isSubmitting}
          loading={loading}
        >
          패스워드 변경
        </ButtonInactivable>
      </InputContainer>
    </Form>
  );
};

const ProfileEdit: React.FC<{ me: SeeMe_me }> = ({ me }) => {
  const { control, handleSubmit, formState } = useForm<ProfileForm>({
    mode: "onChange",
    defaultValues: {
      username: me.username,
      email: me.email,
      githubUsername: me.githubUsername || "",
      location: me.location || "",
      name: me.name || "",
    },
  });
  const [editProfile] = useMutation<EditProfile, EditProfileVariables>(
    MUTATION_EDIT_PROFILE,
    {
      onCompleted: (data) => {
        setLoading(false);
        if (data.editProfile.ok) {
          window.alert("프로필이 저장되었습니다.");
        } else {
          window.alert("프로필 저장에 실패했습니다.");
        }
      },
    }
  );
  const [loading, setLoading] = useState(false);

  const onValid = (data: ProfileForm) => {
    setLoading(true);
    editProfile({
      variables: {
        id: me.id,
        ...(data.username !== me.username && { username: data.username }),
        ...(data.email !== me.email && { email: data.email }),
        ...(data.location !== "" &&
          data.location !== me.location && { location: data.location }),
        ...(data.name !== "" && data.name !== me.name && { name: data.name }),
        ...(data.githubUsername !== "" &&
          data.githubUsername !== me.githubUsername && {
            githubUsername: data.githubUsername,
          }),
      },
      update(cache, result) {
        if (result.data?.editProfile.ok) {
          cache.modify({
            id: `User:${me.id}`,
            fields: {
              username: () => data.username,
              name: () => data.name,
              email: () => data.email,
              githubUsername: () => data.githubUsername,
              location: () => data.location,
            },
          });
        } else {
          window.alert(`업데이트 실패: ${result.data?.editProfile.error}`);
        }
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <InputContainer>
        <ControlledInput
          control={control}
          rules={{
            required: true,
            minLength: {
              value: 4,
              message: "4글자 이상 입력해주세요",
            },
            maxLength: {
              value: 20,
              message: "20글자 이하로 입력해주세요.",
            },
          }}
          name="username"
          type="text"
          label="사용자이름"
          placeholder="사용자이름"
        />

        <ControlledInput
          control={control}
          rules={{
            required: true,
            pattern: {
              value: EMAIL_REGEX,
              message: "이메일 주소가 아닙니다.",
            },
          }}
          name="email"
          label="이메일 주소"
          type="text"
          placeholder="이메일 주소를 입력해주세요."
        />
        <ControlledInput
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: "3글자 이상 입력해주세요",
            },
            maxLength: {
              value: 20,
              message: "20글자 이하로 입력해주세요.",
            },
          }}
          label="성함"
          name="name"
          type="text"
          placeholder="성함을 입력해주세요."
        />
        <ControlledInput
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: "3글자 이상 입력해주세요",
            },
            maxLength: {
              value: 39,
              message: "39글자 이하로 입력해주세요.",
            },
          }}
          label="깃허브 유저명"
          name="githubUsername"
          type="text"
          placeholder="깃허브 유저명을 입력해주세요."
        />
        <ControlledInput
          control={control}
          rules={{
            minLength: {
              value: 4,
              message: "4 글자 이상 입력해주세요.",
            },
            maxLength: {
              value: 100,
              message: "100글자 이하로 입력해주세요.",
            },
          }}
          name="location"
          label="지역 또는 위치"
          placeholder="지역 또는 위치를 입력해주세요."
        />

        <ButtonInactivable
          isActivate={
            formState.isValid && !formState.isSubmitting && formState.isDirty
          }
          loading={loading}
        >
          업데이트
        </ButtonInactivable>
      </InputContainer>
    </Form>
  );
};

export const ProfileEditPage = () => {
  const [tab, setTab] = useState(0); // 0 === profile, 1 === password
  const { data: me, loading } = useMe();

  const onTabClick = (index: number) => () => {
    setTab(index);
  };

  return (
    <>
      {loading && <PageLoader />}
      {!loading && me && me.me && (
        <Container>
          <TabContainer>
            <TabItem onClick={onTabClick(0)} isActive={tab === 0}>
              프로필 편집
            </TabItem>
            <TabItem onClick={onTabClick(1)} isActive={tab === 1}>
              패스워드 변경
            </TabItem>
          </TabContainer>
          <TabContent>
            {me && tab === 0 && <ProfileEdit me={me.me} />}
            {me && tab === 1 && <PasswordEdit me={me.me} />}
          </TabContent>
        </Container>
      )}
    </>
  );
};
