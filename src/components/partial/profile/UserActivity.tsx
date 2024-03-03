import { Loader } from "@/components/common/Loader";
import { EXPLORER_URL } from "@/config";
import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import {
  // formatBigIntWithUnits,
  parseIpfsUrl,
} from "@/helpers";
import { getHistory } from "@/helpers/api";
import { formatRemainingInterval } from "@/helpers/time";
import { Button, Dropdown, Table } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

type Props = {
  address: string;
};

const UserActivity: FC<Props> = ({ address }) => {
  const now = useCurrentTime();

  const [typeFilter, setTypeFilter] = useState<FilterType[]>([
    "Transfer",
    "Sale",
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedAll, setLoadedAll] = useState<boolean>(false);
  const [history, setHistory] = useState<ItemHistory[]>([]);

  const fetchHistory = useCallback(
    async (offset: number) => {
      setLoading(true);
      try {
        const data = await getHistory(typeFilter, offset, address, undefined);

        if (offset == 0) {
          setLoadedAll(false);
          setHistory(data[1]);
        } else {
          setHistory([...history, ...data[1]]);
        }

        if (data[1]?.length < 20) {
          setLoadedAll(true);
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err?.response?.data?.reason);
      }
      setLoading(false);
    },
    [history, address, typeFilter],
  );

  const toggleFilterType = useCallback(
    (newFilter: FilterType) => {
      if (!typeFilter.includes(newFilter)) {
        setTypeFilter([...typeFilter, newFilter]);
      }
    },
    [typeFilter],
  );

  const loadMore = useCallback(async () => {
    await fetchHistory(history.length);
  }, [fetchHistory, history]);

  useEffect(() => {
    setHistory([]);
    fetchHistory(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, address]);

  return (
    <div>
      <div className="sticky -top-4 z-20 flex w-full bg-white p-2 pr-5 dark:bg-slate-900">
        <div className="relative w-40">
          <Dropdown
            label="Filter"
            dismissOnClick
            className="w-full"
            color="gray"
          >
            <Dropdown.Item onClick={() => toggleFilterType("Reveal")}>
              Reveal
            </Dropdown.Item>
            <Dropdown.Item onClick={() => toggleFilterType("Transfer")}>
              Transfer
            </Dropdown.Item>
            <Dropdown.Item onClick={() => toggleFilterType("Sale")}>
              Sale
            </Dropdown.Item>
            <Dropdown.Item onClick={() => toggleFilterType("Listing")}>
              Listing
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex flex-1 gap-1">
          {typeFilter.map((filter) => (
            <Button
              key={filter}
              outline
              color="gray"
              onClick={() =>
                setTypeFilter(typeFilter.filter((item) => item != filter))
              }
            >
              {filter}
              <FaTimes className="ml-1 h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
      <div className="relative w-full overflow-y-auto overflow-x-hidden">
        <Table>
          <Table.Body className="divide-y">
            {history.map((item) => (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-slate-700 dark:bg-slate-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
                  <Link href={`/market/${item.pixel.tokenId}`}>
                    <div className="flex max-w-[12vw] items-center">
                      <div className="relative h-10 w-10 overflow-hidden rounded-sm">
                        <div className="relative flex h-full min-h-[inherit] w-full flex-col items-center justify-center rounded-[inherit]">
                          <Image
                            layout="fill"
                            src={parseIpfsUrl(item.pixel.image)}
                            alt="Asset Image"
                          />
                        </div>
                      </div>
                      <div className="ml-5 max-w-[calc(100%-80px)] gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
                            {item.pixel.name}
                          </span>
                          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold opacity-70">
                            {item.pixel.right - item.pixel.left + 1} X{" "}
                            {item.pixel.bottom - item.pixel.top + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
                  {item.type}
                </Table.Cell>
                <Table.Cell>
                  {/* {item?.data
                    ? `${formatBigIntWithUnits(BigInt(item.data))} ETH`
                    : "-"} */}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/profile/${item.fromId}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {/* {owner == item.fromId
                      ? "You"
                      : item?.from?.name ?? shortenString(item.fromId)} */}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {item?.toId ? (
                    <Link
                      href={`/profile/${item.toId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {/* {owner == item.toId
                        ? "You"
                        : item?.to?.name ?? shortenString(item.toId)} */}
                    </Link>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex h-full items-center">
                    {formatRemainingInterval(
                      now -
                        Math.floor(new Date(item?.createdAt).getTime() / 1000),
                    )}{" "}
                    ago
                    {item.transaction && (
                      <span className="my-auto ml-1">
                        <Link
                          href={`${EXPLORER_URL}tx/${item.transaction}`}
                          target="_blank"
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </Link>
                      </span>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {loading && (
        <div className="col-span-full mt-4 h-10 w-full">
          <Loader />
        </div>
      )}
      {!loading && !loadedAll && (
        <Button color="gray" onClick={loadMore} className="mt-4 w-full">
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserActivity;
