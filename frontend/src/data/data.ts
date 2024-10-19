// src/data.ts
export type FileType = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileType[];
};

// src/data.ts
export const initialFiles = [
  {
    id: "1",
    name: "Folder A",
    type: "folder",
    children: [
      {
        id: "2",
        name: "Folder B",
        type: "folder",
        children: [
          {
            id: "2-1",
            name: "Folder B1",
            type: "folder",
            children: [
              { id: "2-1-1", name: "File B1a", type: "file" },
              { id: "2-1-2", name: "File B1b", type: "file" },
            ],
          },
          {
            id: "2-2",
            name: "Folder B2",
            type: "folder",
            children: [
              { id: "2-2-1", name: "File B2a", type: "file" },
              { id: "2-2-2", name: "File B2b", type: "file" },
            ],
          },
          { id: "3-1", name: "File C1", type: "file" },
        ],
      },
      {
        id: "3",
        name: "Folder C",
        type: "folder",
        children: [
          { id: "3-1", name: "File C1", type: "file" },
          { id: "3-2", name: "File C2", type: "file" },
        ],
      },
    ],
  },
];
