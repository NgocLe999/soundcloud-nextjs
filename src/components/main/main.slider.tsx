"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import Box from "@mui/material/Box";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import { convertSlugUrl } from "../ultils/api";
import Image from "next/image";
interface IProps {
  data: IData[];
  title: string;
}
/// ép kiểu props của data lấy được
const MainSlider = (props: IProps) => {
  const { data, title } = props;

  // console.log("check data props", data);

  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <Button
        variant="text"
        onClick={onClick}
        sx={{
          height: "32px",
          minWidth: "32px",
          position: "absolute",
          top: "42%",
          transform: " translate(0, -50%)",
          right: "-16px",
          border: "1px solid #e5e5e5;",
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "white",
            border: "1px solid #f70;",
          },
        }}
      >
        <NavigateNextIcon
          sx={{
            color: "#333",
            ":hover": {
              color: "#f70;",
            },
          }}
        />
      </Button>
    );
  }

  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <Button
        variant="text"
        onClick={onClick}
        sx={{
          height: "32px",
          minWidth: "32px",
          left: "-8px",
          position: "absolute",
          top: "42%",
          transform: " translate(0, -50%)",
          zIndex: 10,
          border: "1px solid #e5e5e5;",
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "white",
            border: "1px solid #f70;",
          },
        }}
      >
        <NavigateBeforeIcon
          sx={{
            color: "#333",
            ":hover": {
              color: "#f70;",
            },
          }}
        />
      </Button>
    );
  }
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Box
      sx={{
        marginTop: "0 50px",
        ".track": {
          padding: "0 10px",
          width: 300,
          img: { height: 200, width: 200 },
        },
        h3: {
          border: "1px solid #333",
          height: "200px",
          padding: "20px",
        },
      }}
    >
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => {
          return (
            <div className="track" key={item._id}>
              <Image
                height={250}
                width={250}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                alt="slider-content"
              />
              {/* <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
              /> */}
              <Link
                href={`/track/${convertSlugUrl(item.title)}-${
                  item._id
                }.html?audio=${item.trackUrl}`}
                style={{
                  textDecoration: "none",
                  color: "#333",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  margin: "10px 0px",
                  fontWeight: 500,
                  display: "block",
                  width: "220px",
                }}
              >
                {item.title}
              </Link>
              <h5 style={{ color: "#999", margin: 0 }}>{item.description}</h5>
            </div>
          );
        })}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
