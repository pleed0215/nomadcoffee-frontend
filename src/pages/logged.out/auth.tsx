import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

import styled, { keyframes } from "styled-components";
import { makeLogin } from "../../apollo/vars";
import { ReactComponent as CoffeeBean } from "../../assets/bean.svg";
import {
  CreateAccount,
  CreateAccountVariables,
} from "../../codegen/CreateAccount";
import { MUTATION_CREATE_ACCOUNT, MUTATION_LOGIN } from "../../apollo/queries";
import { Login, LoginVariables } from "../../codegen/Login";
import { ButtonInactivable } from "../../components/ButtonInactivable";
import { ControlledInput } from "../../components/ControlledInput";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";

// AuthPage 컴포넌트 props.
type AuthPageProps = {
  isCreating?: boolean;
};

// react-hook-form에서 사용할 변수들.
type IAuthForm = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

// styled-components 애니메이션 사용 위해..
// 위에서 떨어지는 애니메이션, 단순하게 내려오기만 함.
const topToBototm = keyframes`
    from {
        color: rgba(255, 255, 255, 0.2);
        transform: translateY(-270px);
    }
    to {
        color: rgba(255, 255, 255, 0.9);
        transform: translateY(0px);
    }
`;

// fade in 애니메이션.
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  // 조금 시차를 주려고..
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

// 가장 외부 박스..
const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("/intro.jpg");

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

// InputBox 위에 호출되어 타이틀을 넣음.
const InputBoxCap = styled.div`
  width: 100%;
  height: 60px;
  background-color: #6f4e37;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// isCreating에 따라 높이 달리..
const InputBox = styled.div<{ isCreating?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 350px;
  max-width: 450px;
  min-height: ${(props) => (props.isCreating ? "490px" : "350px")};
  background-color: rgba(140, 140, 140, 0.8);
  animation: ${fadeIn} 0.9s linear;
  margin-top: 24px;
  border-radius: 10px;
  overflow: hidden;
`;

const Title = styled.h1`
  font-family: LuckiestGuy;
  font-size: 3rem;
  color: white;
  letter-spacing: 0.4rem;
  animation: ${topToBototm} 0.4s linear;
`;

const Welcome = styled.h3`
  font-size: 2rem;
  color: white;
  text-align: center;
`;

const InputForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
`;

const BottomText = styled.span`
  margin-top: 16px;
  font-size: 1.5rem;
  color: #222;
  text-align: center;
`;

const SLink = styled(Link)`
  color: #6f4e37;
`;

const Error = styled.span`
  color: red;
  text-align: center;
  font-style: underline;
  margin-top: 4px;
`;

export const AuthPage: React.FC<AuthPageProps> = ({ isCreating }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createAccount] = useMutation<CreateAccount, CreateAccountVariables>(
    MUTATION_CREATE_ACCOUNT,
    {
      onCompleted: (data) => {
        setLoading(false);
        if (data.createAccount.ok) {
          history.push("/signin");
        } else {
          setError(`회원 가입실패: ${data.createAccount.error}`);
        }
      },
    }
  );
  const [login] = useMutation<Login, LoginVariables>(MUTATION_LOGIN, {
    onCompleted: (data) => {
      setLoading(false);
      if (data.login.token && data.login.ok) {
        history.push("/");
        makeLogin(data.login.token);
      } else {
        setError(`로그인 실패: ${data.login.error}`);
      }
    },
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };
  const { control, getValues, handleSubmit, formState, reset } =
    useForm<IAuthForm>({
      mode: "onBlur",
      defaultValues,
    });
  const { isValid, isDirty } = formState;
  const onValid = (data: IAuthForm) => {
    setLoading(true);
    if (isCreating) {
      const { password2, ...variables } = data;
      createAccount({
        variables,
      });
    } else {
      const { email, password } = data;
      login({ variables: { email, password } });
    }
  };

  useEffect(() => {
    reset({ username: "", email: "", password: "", password2: "" });
    setError(null);
  }, [isCreating, reset]);

  return (
    <Container>
      <HelmetOnlyTitle title="Welcome" />
      <Title>
        <CoffeeBean
          width="40"
          height="40"
          fill="#ffffff"
          style={{ marginRight: 10 }}
        />
        Nomad Coffee
        <CoffeeBean
          width="40"
          height="40"
          fill="#ffffff"
          style={{ marginLeft: 10 }}
        />
      </Title>
      <InputBox isCreating={isCreating}>
        <InputBoxCap>
          <Welcome>Welcome!</Welcome>
        </InputBoxCap>

        <InputForm onSubmit={handleSubmit(onValid)}>
          <InputContainer>
            <ControlledInput
              control={control}
              label="이메일"
              type="text"
              name="email"
              rules={{
                required: { value: true, message: "이메일을 입력해주세요." },
                pattern: {
                  value: /\w+@\w+\.\w+/g,
                  message: "올바른 이메일 주소를 입력해주세요.",
                },
                minLength: { value: 4, message: "4글자 이상 필요해요." },
                maxLength: { value: 30, message: "너무 길어요. 30글자 미만." },
              }}
              placeholder="이메일 주소를 입력해주세요."
            />
            {isCreating && (
              <ControlledInput
                control={control}
                label="유저이름"
                type="text"
                name="username"
                rules={{
                  required: {
                    value: true,
                    message: "유저이름을 입력해주세요.",
                  },
                  minLength: { value: 4, message: "4글자 이상 필요해요." },
                  maxLength: {
                    value: 16,
                    message: "너무 길어요. 16글자 미만.",
                  },
                }}
                placeholder="4-16글자까지 가능합니다."
              />
            )}
            <ControlledInput
              control={control}
              label="암호"
              type="password"
              name="password"
              rules={{
                required: { value: true, message: "암호를 입력해주세요." },
                minLength: { value: 8, message: "8글자 이상 필요해요." },
                maxLength: { value: 20, message: "너무 길어요. 20글자 미만." },
              }}
              placeholder="패스워드. 8-20글자까지 가능합니다."
            />
            {isCreating && (
              <ControlledInput
                control={control}
                label="암호 확인"
                type="password"
                name="password2"
                rules={{
                  required: { value: true, message: "암호를 확인해주세요." },
                  validate: (password2) =>
                    password2 === getValues("password") ||
                    "패스워드가 일치하지 않습니다.",
                }}
                placeholder="입력한 패스워드를 확인해주세요."
              />
            )}
            <div style={{ marginBottom: 16 }} />
            <ButtonInactivable
              isActivate={isValid && isDirty && !loading}
              loading={loading}
            >
              {isCreating ? "가입하기" : "로그인"}
            </ButtonInactivable>
            {error && <Error>{error}</Error>}
          </InputContainer>

          {isCreating && (
            <BottomText>
              😀 이미 가입하셨다면, <SLink to="/signin">로그인하기</SLink> 😀
            </BottomText>
          )}
          {!isCreating && (
            <BottomText>
              😀 아직 회원 아니시면,<SLink to="/">가입하기</SLink> 😀
            </BottomText>
          )}
        </InputForm>
      </InputBox>
    </Container>
  );
};
