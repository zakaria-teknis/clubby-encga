import { useEffect } from "react";
import { Container } from "react-bootstrap";
import HomePageFeatures from "../../components/home/HomePageFeatures";
import HomePageHeroArea from "../../components/home/HomePageHeroArea";
import HomePageBody from "../../components/home/HomePageBody";

export default function HomePage() {
  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL);
  }, []);
  
  return (
    <Container fluid className="p-0">
      <HomePageHeroArea />
      <HomePageFeatures />
      <HomePageBody />
    </Container>
  );
}
