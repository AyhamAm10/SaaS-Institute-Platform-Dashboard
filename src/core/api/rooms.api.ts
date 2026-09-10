import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export type RoomType = 'CLASSROOM' | 'LAB' | 'HALL' | 'ACTIVITY';

export interface RoomAvailability {
  id: number;
  roomId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Room {
  id: number;
  instituteId: number;
  branchId?: number | null;
  name: string;
  type: RoomType | string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: number;
    name: string;
  } | null;
  availabilities?: RoomAvailability[];
  _count?: {
    timetableEntries: number;
  };
}

export interface PaginatedRooms {
  data: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoomsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  branchId?: number;
}

export interface CreateRoomPayload {
  name: string;
  type: RoomType | string;
  capacity: number;
  branchId?: number | null;
  availabilities?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface UpdateRoomPayload {
  name?: string;
  type?: RoomType | string;
  capacity?: number;
  branchId?: number | null;
}

export interface RoomAvailabilityWindowPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getRooms(params?: RoomsQueryParams): Promise<PaginatedRooms> {
  const { data } = await apiClient.get<PaginatedRooms>('/rooms', { params });
  return data;
}

export async function getRoomById(id: number): Promise<Room> {
  const { data } = await apiClient.get<Room>(`/rooms/${id}`);
  return data;
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  const { data } = await apiClient.post<Room>('/rooms', payload);
  return data;
}

export async function updateRoom(
  id: number,
  payload: UpdateRoomPayload,
): Promise<Room> {
  const { data } = await apiClient.patch<Room>(`/rooms/${id}`, payload);
  return data;
}

export async function deleteRoom(id: number): Promise<void> {
  await apiClient.delete(`/rooms/${id}`);
}

export async function setRoomAvailabilities(
  roomId: number,
  windows: RoomAvailabilityWindowPayload[],
): Promise<RoomAvailability[]> {
  const { data } = await apiClient.put<RoomAvailability[]>(
    `/rooms/${roomId}/availability`,
    { windows },
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const roomsKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomsKeys.all, 'list'] as const,
  list: (params?: RoomsQueryParams) => [...roomsKeys.lists(), params] as const,
  details: () => [...roomsKeys.all, 'detail'] as const,
  detail: (id: number) => [...roomsKeys.details(), id] as const,
};

export function useRoomsQuery(params?: RoomsQueryParams) {
  return useQuery({
    queryKey: roomsKeys.list(params),
    queryFn: () => getRooms(params),
    placeholderData: (prev) => prev,
  });
}

export function useRoomDetailsQuery(id: number) {
  return useQuery({
    queryKey: roomsKeys.detail(id),
    queryFn: () => getRoomById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsKeys.all });
    },
  });
}

export function useUpdateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRoomPayload }) =>
      updateRoom(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomsKeys.all });
      queryClient.invalidateQueries({ queryKey: roomsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsKeys.all });
    },
  });
}

export function useSetRoomAvailabilitiesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      windows,
    }: {
      roomId: number;
      windows: RoomAvailabilityWindowPayload[];
    }) => setRoomAvailabilities(roomId, windows),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomsKeys.detail(variables.roomId) });
    },
  });
}
