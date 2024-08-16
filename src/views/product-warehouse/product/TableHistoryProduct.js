import { Timeline, timelineItemClasses } from "@mui/lab";
import { Card, CardContent } from "@mui/material";

import { useRouter } from "next/router";
import TimelineItemHistory from "./TimelineItemHistory";

export default function TableHistoryProduct({ history, product }) {
  const router = useRouter()
  return (
    <Card>
      <CardContent>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 2,
            },
          }}
        >
          {
            history?.map((item, index) => (
              <TimelineItemHistory
                index={index}
                key={index}
                length={history.length}
                router={router}
                {...item}
              />
            ))
          }
        </Timeline>
      </CardContent>
    </Card>
  )
}