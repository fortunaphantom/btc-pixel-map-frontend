/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import { Loader } from "@/components/common/Loader";
import { searchPixel } from "@/helpers/api";
import { Button, Dropdown, TextInput } from "flowbite-react";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaListUl, FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { SORT_OPTIONS } from "./constants";
import GridView from "./views/GridView";
import ListView from "./views/ListView";

// eslint-disable-next-line sonarjs/cognitive-complexity
const MarketItems: FC = ({}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchString, setSearchString] = useState<string>();
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [filter, setFilter] = useState<FilterOption>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedAll, setLoadedAll] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>();
  const [pixels, setPixels] = useState<Pixel[]>([]);

  const toggleStatus = useCallback(
    (status: ItemStatus) =>
      (filter?.status ?? []).includes(status)
        ? setFilter({
            ...filter,
            status: (filter?.status ?? []).filter((item) => item != status),
          })
        : setFilter({ ...filter, status: [...(filter?.status ?? []), status] }),
    [filter],
  );

  const fetchPixels = useCallback(
    async (offset: number) => {
      const payload = {
        query: searchString,
        filter: filter,
        sort: sortOption?.value,
      };

      setIsLoading(true);
      try {
        const data = await searchPixel(offset, payload);

        if (offset == 0) {
          setLoadedAll(false);
          setTotalCount(data[0]);
          setPixels(data[1]);
        } else {
          setPixels([...pixels, ...data[1]]);
        }

        if (data[1]?.length < 24) {
          setLoadedAll(true);
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err?.response?.data?.reason);
      }
      setIsLoading(false);
    },
    [filter, pixels, searchString, sortOption],
  );

  const loadMore = useCallback(async () => {
    await fetchPixels(pixels.length);
  }, [fetchPixels, pixels]);

  useEffect(() => {
    setPixels([]);
    const timer = setTimeout(() => fetchPixels(0), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchString, sortOption]);

  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-20 flex w-full shrink-0 flex-col items-start gap-2 bg-slate-50 px-1 py-2 dark:bg-slate-900 md:flex-row md:items-center md:gap-0">
        <Button
          size="sm"
          color="gray"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hidden md:block"
        >
          <MdFilterList className="h-6 w-6" />
        </Button>
        <div className="shrink-0 md:ml-4 md:mr-3">
          <div className="">{totalCount ?? "-"} Results</div>
        </div>
        <div className="w-full md:ml-3">
          <TextInput
            id="tick"
            type="string"
            icon={FaSearch}
            placeholder="Search by name or description"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            color="gray"
          />
        </div>
        <div className="mx-auto flex shrink-0 flex-col items-stretch md:mx-0 md:ml-auto md:pl-3">
          <Dropdown color="gray" dismissOnClick={true} label={sortOption.title}>
            {SORT_OPTIONS.map((item) => (
              <Dropdown.Item
                key={item.value}
                onClick={() => setSortOption(item)}
              >
                {item.title}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div className="ml-2 hidden shrink-0 grid-cols-1 rounded-lg bg-slate-200 p-1 dark:bg-slate-800 md:grid md:grid-cols-2">
          <div
            className={twMerge(
              "cursor-pointer rounded-lg p-2",
              viewMode == "list" && "bg-slate-400 dark:bg-slate-700",
            )}
            role="button"
            tabIndex={0}
            onClick={() => setViewMode("list")}
          >
            <FaListUl className="h-5 w-5" />
          </div>
          <div
            className={twMerge(
              "cursor-pointer rounded-lg p-2",
              viewMode == "grid" && "bg-slate-400 dark:bg-slate-700",
            )}
            role="button"
            tabIndex={0}
            onClick={() => setViewMode("grid")}
          >
            <BsFillGrid3X3GapFill className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex h-full w-full">
        <div className="shrink-0">
          <div
            className={twMerge(
              "sticky top-16 hidden flex-col gap-2 overflow-hidden py-2 transition-all duration-200 md:flex",
              isSidebarOpen ? "w-64" : "w-0",
            )}
          >
            <CollapsibleCard title="Status">
              <div className="flex w-full flex-wrap gap-1 p-2">
                <Button
                  color={filter?.status?.length ? "gray" : "light"}
                  size="sm"
                  onClick={() => setFilter({ ...filter, status: [] })}
                >
                  All
                </Button>
                <Button
                  color={
                    (filter?.status ?? []).includes("list") ? "light" : "gray"
                  }
                  size="sm"
                  onClick={() => toggleStatus("list")}
                >
                  Listed
                </Button>
              </div>
            </CollapsibleCard>
            <CollapsibleCard title="Price" opened={false}>
              <div className="flex w-full items-center justify-between gap-2 p-2">
                <TextInput
                  className="text-center"
                  type="number"
                  placeholder="Min"
                  // value={filter?.price?.from}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      price: {
                        ...filter?.price,
                        from:
                          isNaN(+e.target.value) || !e.target.value?.length
                            ? undefined
                            : +e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <TextInput
                  className="text-center"
                  type="number"
                  placeholder="Max"
                  // value={filter?.price?.to}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      price: {
                        ...filter?.price,
                        to:
                          isNaN(+e.target.value) || !e.target.value?.length
                            ? undefined
                            : +e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CollapsibleCard>
            <CollapsibleCard title="size" opened={false}>
              <div className="flex w-full items-center justify-between gap-2 p-2">
                <TextInput
                  className="text-center"
                  type="number"
                  placeholder="Min"
                  // value={filter?.size?.from}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      size: {
                        ...filter?.size,
                        from:
                          isNaN(+e.target.value) || !e.target.value?.length
                            ? undefined
                            : +e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <TextInput
                  className="text-center"
                  type="number"
                  placeholder="Max"
                  // value={filter?.size?.to}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      size: {
                        ...filter?.size,
                        to:
                          isNaN(+e.target.value) || !e.target.value?.length
                            ? undefined
                            : +e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CollapsibleCard>
          </div>
        </div>
        <div
          className={twMerge(
            "flex flex-col overflow-auto p-2",
            isSidebarOpen ? "w-[calc(100%-256px)]" : "w-full",
          )}
        >
          {viewMode == "list" ? (
            <ListView pixels={pixels} />
          ) : (
            <GridView isSidebarOpen={isSidebarOpen} pixels={pixels} />
          )}
          {isLoading && (
            <div className="h-10 w-full">
              <Loader />
            </div>
          )}
          {!isLoading && !loadedAll && (
            <Button color="gray" onClick={loadMore}>
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
