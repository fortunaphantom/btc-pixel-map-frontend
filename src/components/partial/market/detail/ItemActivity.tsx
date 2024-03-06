import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import { Loader } from "@/components/common/Loader";
import { EXPLORER_URL } from "@/config";
import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { getHistory } from "@/helpers/api";
import { formatRemainingInterval } from "@/helpers/time";
import { Button, Dropdown, Table } from "flowbite-react";
import Link from "next/link";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

type Props = {
  pixel: Pixel;
};

const ItemActivity: FC<Props> = ({ pixel }) => {
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
        const data = await getHistory(typeFilter, offset, undefined, pixel.id);

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
    [history, pixel.id, typeFilter],
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
  }, [typeFilter]);

  return (
    <div className="mb-5 flex w-full overflow-auto px-2">
      <CollapsibleCard
        title="Item Activity"
        icon={<FaArrowRightArrowLeft className="h-5 w-5" />}
        className="w-full"
      >
        <div className="flex w-full p-2 pr-5">
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
        <div className="relative h-72 w-full overflow-y-auto overflow-x-hidden">
          <Table>
            <Table.Body className="divide-y">
              {history.map((item) => (
                <Table.Row
                  key={item.id}
                  className="bg-white dark:border-slate-700 dark:bg-slate-800"
                >
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
                      {/* {address == item.fromId
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
                        {/* {address == item.toId
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
                          Math.floor(
                            new Date(item?.createdAt).getTime() / 1000,
                          ),
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
          {loading && (
            <div className="col-span-full h-10 w-full">
              <Loader />
            </div>
          )}
          {!loading && !loadedAll && (
            <Button color="gray" onClick={loadMore} className="col-span-full">
              Load More
            </Button>
          )}
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default ItemActivity;
