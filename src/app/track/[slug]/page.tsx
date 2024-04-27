import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/components/ultils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

import type { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  return [
    { slug: "song-cho-het-doi-thanh-xuan-660a78c64c7603a4c3612dee.html" },
    { slug: "khi-con-mo-dan-phai-660a78c64c7603a4c3612de9.html" },
    { slug: "truy-lung-bao-vat-660a78c64c7603a4c3612de6.html" },
  ];
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  // const id = params.id

  // fetch data
  // convert params slug = id
  const paramString = params.slug;
  const slug = paramString.split(".html") ?? [];
  const slug1 = slug[0].split("-") ?? [];
  const id = slug1[slug1.length - 1] ?? "";

  const res = await sendRequest<IBackendRes<IData>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      // cache: "no-store"
      next: { tags: ["track-by-tag"] },
    },
  }); 

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Lê Xuân Ngọc",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/imageshosting/master/eric.png`,
      ],
    },
  };
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const session = await getServerSession(authOptions);

  // convert params slug = id
  const paramString = params.slug;
  const slug = paramString.split(".html") ?? [];
  const slug1 = slug[0].split("-") ?? [];
  const id = slug1[slug1.length - 1] ?? "";

  // get track by id
  const res = await sendRequest<IBackendRes<IData>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    // nextOption: { cache: "no-store" },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  /// get comments by a track
  const res1 = await sendRequest<IBackendRes<IModelPaginate<IComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt", /// tự động sắp xếp vừa mới tạo xong sẽ lên đầu
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <Container>
      <WaveTrack
        track={res?.data ?? null}
        //@ts-ignore
        comments={res1?.data?.result ?? null}
      />
    </Container>
  );
};

export default DetailTrackPage;
