export class CreatePostDto {
  id: string;
  title: string;
  content: string;
  author: {
    connect: {
      id: string;
    };
  };
}
