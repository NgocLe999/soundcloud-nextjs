"use client";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { convertSlugUrl, sendRequest } from "../ultils/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientSearch = () => {
  const searchParams = useSearchParams();
  const [resultSearch, setResultSearch] = useState<IData[]>([]);

  const query = searchParams.get("q");

  const searchResult = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<IData>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res?.data) {
      setResultSearch(res?.data?.result);
    }
    // console.log("check res", res?.data?.result);
    // const result = res?.data?.result;
  };

  useEffect(() => {
    // document title

    document.title = `Search '${query}'`;
    if (query) {
      searchResult(query);
    }
  }, [query]);

  return (
    <>
      {resultSearch.length === 0 ? (
        <div> Không tìm thấy kết quả: {query}</div>
      ) : (
        <div style={{ fontWeight: 600, marginBottom: "20px" }}>
          Kết quả tìm kiếm cho từ khóa: {query}
        </div>
      )}

      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
        }}
      >
        {resultSearch &&
          resultSearch.map((result) => {
            return (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  alignItems: "center",
                }}
              >
                <Image
                  alt="image-track"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${result?.imgUrl}`}
                  height={35}
                  width={35}
                />
                <Link
                  style={{
                    textDecoration: "none",
                    color: "unset",
                    fontWeight: 500,
                  }}
                  href={`/track/${convertSlugUrl(result.title)}-${
                    result._id
                  }.html?audio=${result.trackUrl}`}
                >
                  {result.title}
                </Link>
              </div>
            );
          })}
      </Box>
    </>
  );
};

export default ClientSearch;
