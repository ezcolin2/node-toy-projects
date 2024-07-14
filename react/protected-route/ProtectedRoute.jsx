import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const ProtectedRoute = ({ children, redirectUrl }) => {
  // api 응답 성공 여부 
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`)
    .then(()=>{
      // 요청이 성공적으로 오면 
      setIsSuccess(true);
    })
    .catch((error)=>{
      navigate(redirectUrl);
    })
  }, []);

  // 응답이 완료된 후 자식 컴포넌트를 렌더링한다.
  if (isSuccess){
    return children;

  }
};
