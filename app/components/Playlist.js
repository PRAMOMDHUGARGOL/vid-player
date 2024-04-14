import { FaPlay } from "react-icons/fa";

const PlayList = ({ video, currentVideoIndex, index }) => {
  return (
    <div className="flex mb-5 ">
      <div className=" flex items-center pl-1 pr-2 text-sm font-medium text-white text-right">
        {index === parseInt(currentVideoIndex) ? (
          <div className="size-6 flex items-center justify-end mr-5">
            <FaPlay />
          </div>
        ) : (
          <span className="size-6 mr-5"> {index + 1}</span>
        )}
      </div>

      <div className="relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800 overflow-hidden cursor-pointer">
        <img className="h-full w-full object-cover" src={video.images} />
      </div>
      <div className="flex flex-col ml-3 overflow-hidden cursor-pointer">
        <span className="text-sm lg:text-xs xl:text-sm font-bold line-clamp-2">
          {video?.title}
        </span>
        <span className="text-[12px] lg:text-[10px] xl:text-[12px] font-semibold mt-2 text-black/[0.7] flex items-center">
          {video?.subtitle}
        </span>
      </div>
    </div>
  );
};
export default PlayList;
