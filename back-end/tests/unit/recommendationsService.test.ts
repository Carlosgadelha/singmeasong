/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from "@jest/globals"

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import { recommendationService } from "../../src/services/recommendationsService.js"

jest.mock("../../src/repositories/recommendationRepository.js")

describe("RecommendationService test suite", () => {
  it("should create recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementation((): any => {})
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementation((): any => {
        return null
      })

    await recommendationService.insert({
      name: "test",
      youtubeLink: "www.youtube.com/test",
    })
    expect(recommendationRepository.create).toBeCalled()
  })

  it("should return error, when trying to create a recommendation that already exists", async () => {
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementation((): any => {})
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementation((): any => {
        return { name: "test", youtubeLink: "www.youtube.com/test" }
      })

    const promise = recommendationService.insert({
      name: "test",
      youtubeLink: "www.youtube.com/test",
    })

    expect(promise).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    })
  })

  it("should upvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {})
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return {
        id: 1,
        name: "test",
        youtubeLink: "www.youtube.com/test",
        score: 0,
      }
    })

    await recommendationService.upvote(1)
    expect(recommendationRepository.updateScore).toBeCalled()
  })

  it("should return error, upvote by id invalid", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {})
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return null
    })

    const promise = recommendationService.upvote(1)
    expect(promise).rejects.toEqual({ message: "", type: "not_found" })
  })

  it("should downvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {
        return {
          id: 1,
          name: "test",
          youtubeLink: "www.youtube.com/test",
          score: -6,
        }
      })
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return {
        id: 1,
        name: "test",
        youtubeLink: "www.youtube.com/test",
        score: -5,
      }
    })

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementation((): any => {})

    await recommendationService.downvote(1)
    expect(recommendationRepository.remove).toBeCalled()
  })

  it("should return error, downvote by id invalid", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {})
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return null
    })

    const promise = recommendationService.downvote(1)
    expect(promise).rejects.toEqual({ message: "", type: "not_found" })
  })

  it("should get recommendation by id", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return {
        id: 1,
        name: "test",
        youtubeLink: "www.youtube.com/test",
        score: 0,
      }
    })

    const recommendation = await recommendationService.getById(1)
    expect(recommendation).toEqual({
      id: 1,
      name: "test",
      youtubeLink: "www.youtube.com/test",
      score: 0,
    })
  })

  it("should get all recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 0,
          },
        ]
      })

    const recommendations = await recommendationService.get()
    expect(recommendations.length).toBe(1)
  })

  it("should get top recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 0,
          },
        ]
      })

    const recommendations = await recommendationService.getTop(1)
    expect(recommendations.length).toBe(1)
  })

  it("should get random recommendation, random < 0,7", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => {
      return 0.3
    })
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 20,
          },
        ]
      })

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 20,
          },
        ]
      })

    const recommendation = await recommendationService.getRandom()
    expect(recommendation).toEqual({
      id: 1,
      name: "test",
      youtubeLink: "www.youtube.com/test",
      score: 20,
    })
  })

  it("should get random recommendation, random > 0,7", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => {
      return 0.9
    })
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 10,
          },
        ]
      })

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [
          {
            id: 1,
            name: "test",
            youtubeLink: "www.youtube.com/test",
            score: 10,
          },
        ]
      })

    const recommendation = await recommendationService.getRandom()
    expect(recommendation).toEqual({
      id: 1,
      name: "test",
      youtubeLink: "www.youtube.com/test",
      score: 10,
    })
  })

  it("should get random recommendation return notFoundError", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementation((): any => {
        return []
      })

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return []
      })

    const promise = recommendationService.getRandom()
    expect(promise).rejects.toEqual({ message: "", type: "not_found" })
  })
})
